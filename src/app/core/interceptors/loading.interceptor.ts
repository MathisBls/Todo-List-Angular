import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Simuler un délai pour les requêtes
  const startTime = Date.now();
  console.warn(`🔄 HTTP: ${req.method} ${req.url}`);

  return next(req).pipe(
    finalize(() => {
      const duration = Date.now() - startTime;
      console.warn(`✅ HTTP: ${req.method} ${req.url} (${duration}ms)`);
    })
  );
};
