import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export function useWeightHistory() {
    const { user } = useAuth();

    const [weightHistory, setWeightHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadWeightHistory = async () => {
        if (!user?.id) {
            setWeightHistory([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('weight_history')
                .select('*')
                .eq('user_id', user.id)
                .order('recorded_at', { ascending: true });

            if (error) {
                console.error('Error loading weight history:', error);
                setWeightHistory([]);
                return;
            }

            setWeightHistory(data || []);
        } catch (err) {
            console.error('Unexpected error loading weight history:', err);
            setWeightHistory([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWeightHistory();
    }, [user?.id]);

    const addWeight = async (weight, recordedAt = null) => {
        const numericWeight = Number(weight);

        if (!numericWeight || numericWeight <= 0) {
            console.error('Invalid weight value.');
            return null;
        }

        const dateStr = recordedAt || new Date().toISOString().split('T')[0];

        if (!user?.id) {
            const fallbackData = {
                id: `local-weight-${Date.now()}`,
                weight: numericWeight,
                recorded_at: dateStr,
            };
            setWeightHistory((prev) =>
                [...prev, fallbackData].sort(
                    (a, b) =>
                        new Date(a.recorded_at) - new Date(b.recorded_at)
                )
            );
            return fallbackData;
        }

        const { data, error } = await supabase
            .from('weight_history')
            .insert({
                user_id: user.id,
                weight: numericWeight,
                recorded_at: dateStr,
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving weight:', error);
            return null;
        }

        setWeightHistory((prev) =>
            [...prev, data].sort(
                (a, b) =>
                    new Date(a.recorded_at) - new Date(b.recorded_at)
            )
        );

        return data;
    };

    const updateWeight = async (id, weight, recordedAt) => {
        const numericWeight = Number(weight);

        if (!numericWeight || numericWeight <= 0) {
            console.error('Invalid weight value.');
            return null;
        }

        if (!user?.id) {
            const fallbackUpdated = {
                id,
                weight: numericWeight,
                recorded_at: recordedAt || new Date().toISOString().split('T')[0]
            };
            setWeightHistory((prev) =>
                prev
                    .map((item) => (item.id === id ? { ...item, ...fallbackUpdated } : item))
                    .sort(
                        (a, b) =>
                            new Date(a.recorded_at) - new Date(b.recorded_at)
                    )
            );
            return fallbackUpdated;
        }

        const updates = {
            weight: numericWeight,
        };

        if (recordedAt) {
            updates.recorded_at = recordedAt;
        }

        const { data, error } = await supabase
            .from('weight_history')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating weight:', error);
            return null;
        }

        setWeightHistory((prev) =>
            prev
                .map((item) => (item.id === id ? data : item))
                .sort(
                    (a, b) =>
                        new Date(a.recorded_at) - new Date(b.recorded_at)
                )
        );

        return data;
    };

    const deleteWeight = async (id) => {
        if (!user?.id) {
            setWeightHistory((prev) =>
                prev.filter((item) => item.id !== id)
            );
            return true;
        }

        const { error } = await supabase
            .from('weight_history')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting weight:', error);
            return false;
        }

        setWeightHistory((prev) =>
            prev.filter((item) => item.id !== id)
        );

        return true;
    };

    return {
        weightHistory,
        loading,
        addWeight,
        updateWeight,
        deleteWeight,
        reloadWeightHistory: loadWeightHistory,
    };
}