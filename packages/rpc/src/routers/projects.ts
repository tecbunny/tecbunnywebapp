import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { getAdminDb } from '@tecbunny/core/db';
import { TRPCError } from '@trpc/server';

export const projectsRouter = router({
  getAll: publicProcedure
    .query(async () => {
      try {
        const db = getAdminDb();
        const { data, error } = await db.from('upcoming_projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          if (error.code === '42P01') {
            return [];
          }
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
        return data || [];
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unexpected error' });
      }
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      explanation: z.string(),
      target_amount: z.number(),
      amount_raised: z.number().optional(),
      motive: z.string(),
      detailed_information: z.string(),
      status: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.role !== 'superadmin') {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const db = getAdminDb();
        const insertData = {
          ...input,
          amount_raised: input.amount_raised ?? 0,
          status: input.status || 'Pipeline',
        };

        const { data, error } = await db.from('upcoming_projects')
          .insert([insertData])
          .select()
          .single();

        if (error) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
        return data;
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unexpected error' });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().or(z.number()) }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.role !== 'superadmin') {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      try {
        const db = getAdminDb();
        const { error } = await db.from('upcoming_projects')
          .delete()
          .eq('id', input.id);
        
        if (error) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
        return { success: true };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unexpected error' });
      }
    }),
});
