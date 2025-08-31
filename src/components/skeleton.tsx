import styles from './loading.module.css';

type TProps = {
  width?: string;
  height?: string;
  className?: string;
};

export function Skeleton({ width = '100%', height = '1rem', className = '' }: TProps) {
  return (
    <div 
      className={`${styles.skeleton} ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading content"
    />
  );
}

export function TextSkeleton() {
  return <div className={styles.skeletonText} role="status" aria-label="Loading text" />;
}

export function BlockSkeleton() {
  return <div className={styles.skeletonBlock} role="status" aria-label="Loading content block" />;
}

export function CodeSkeleton() {
  return <div className={styles.skeletonCode} role="status" aria-label="Loading code block" />;
}

type TDocumentSkeletonProps = {
  showCodeBlock?: boolean;
  textLines?: number;
};

export function DocumentSkeleton({ showCodeBlock = true, textLines = 4 }: TDocumentSkeletonProps) {
  return (
    <div className="space-y-4 p-6">
      <div className="space-y-3">
        <Skeleton height="2rem" width="60%" />
        <Skeleton height="1rem" width="40%" />
      </div>
      
      <div className="space-y-2">
        {Array.from({ length: textLines }).map((_, i) => (
          <TextSkeleton key={i} />
        ))}
      </div>
      
      {showCodeBlock && (
        <div className="mt-6">
          <CodeSkeleton />
        </div>
      )}
    </div>
  );
}
