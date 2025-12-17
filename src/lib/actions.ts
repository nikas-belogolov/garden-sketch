'use server';

import plants from '@/data/plants_new.json';

export async function getPlants(): Promise<typeof plants> {
    return plants;
}