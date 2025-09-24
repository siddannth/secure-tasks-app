import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req: any = ctx.switchToHttp().getRequest();
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const line = JSON.stringify({
          ts: new Date().toISOString(),
          userId: req.user?.sub,
          role: req.user?.role,
          method: req.method,
          path: req.url,
          ms: Date.now() - start,
        });
        console.log('[AUDIT]', line);
      }),
    );
  }
}
