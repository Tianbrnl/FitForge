import { generateGeminiResponse } from '../server/gemini.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed.'
        });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Authentication required.'
        });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return res.status(401).json({
                error: 'Invalid authentication.'
            });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const { count, error: usageError } = await supabase
            .from('ai_usage')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('used_at', startOfDay.toISOString());

        if (usageError) {
            console.error('AI usage check error:', usageError);

            return res.status(500).json({
                error: 'Unable to check AI usage.'
            });
        }

        if (count >= 10) {
            return res.status(429).json({
                error:
                    'You have reached your daily limit of 10 AI messages. Please try again tomorrow.'
            });
        }

        const { message, userName } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({
                error: 'Message is required.'
            });
        }

        let athleteName = userName;

        if (!athleteName || athleteName === 'Athlete') {
            const { data: userProfile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .maybeSingle();

            athleteName =
                userProfile?.full_name ||
                user?.user_metadata?.full_name ||
                (user.email ? user.email.split('@')[0] : 'Athlete');
        }

        const reply = await generateGeminiResponse(message, athleteName);

        const { error: usageInsertError } = await supabase
            .from('ai_usage')
            .insert({
                user_id: user.id
            });

        if (usageInsertError) {
            console.error('AI usage recording error:', usageInsertError);
        }

        return res.status(200).json({ reply });
    } catch (error) {
        console.error('AI error:', error);

        return res.status(500).json({
            error: 'Failed to get response from Gemini.'
        });
    }
}