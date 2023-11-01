import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    identify: async () => {
        return {};
    }
} satisfies Actions;
