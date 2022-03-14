import { Button } from 'antd';
import styles from './ErrorFallback.module.less';

export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className={styles['error-fallback']}>
      <div className={styles['inner']}>
        <p className={styles['title']}>出错了</p>
        <pre className={styles['message']}>
          {error.message?.indexOf('failed') > -1
            ? '由于众所周知的原因，Github在国内连接不稳定，请您连接VPN后重试'
            : error.message}
        </pre>
        <Button
          className={styles['button']}
          type="primary"
          onClick={resetErrorBoundary}
        >
          重试
        </Button>
      </div>
    </div>
  );
}
