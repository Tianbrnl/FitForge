import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { generateGeminiResponse } from './gemini.js';
import { createClient } from '@supabase/supabase-js';
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
dotenv.config({
    path: './server/.env'
});
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post('/api/chat', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Authentication required.'
        });
    }

    const token = authHeader.replace('Bearer ', '');

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
        return res.status(401).json({
            error: 'Invalid authentication.'
        });
    }

    console.log('Authenticated user:', user.id);
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

    console.log('AI messages used today:', count);

    if (count >= 10) {
        return res.status(429).json({
            error: 'You have reached your daily limit of 10 AI messages. Please try again tomorrow.'
        });
    }
    try {
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

            athleteName = userProfile?.full_name || user?.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : 'Athlete');
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

        res.json({ reply });
    } catch (error) {
        console.error('Gemini error:', error);

        res.status(500).json({
            error: 'Failed to get response from Gemini.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`FitForge AI server running on http://localhost:${PORT}`);
});