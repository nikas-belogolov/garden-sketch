'use server';

import { PlantProps } from '@/app/app/garden/[gardenId]/common';
import plants from '@/data/plants.json';

export async function getPlants(): Promise<PlantProps[]> {
    return plants;
}