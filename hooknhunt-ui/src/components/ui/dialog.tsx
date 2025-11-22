import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { cn } from '@/lib/utils';

interface DialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
}

const DialogContext = React.createContext<{ onOpenChange: (open: boolean) => void } | null>(null);

export function Dialog({ open, onOpenChange, children }: DialogProps) {
	React.useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onOpenChange(false);
		};
		if (open) {
			document.addEventListener('keydown', onKey);
			// Prevent body scroll when modal is open
			document.body.style.overflow = 'hidden';
		}
		return () => {
			document.removeEventListener('keydown', onKey);
			document.body.style.overflow = 'unset';
		};
	}, [open, onOpenChange]);

	if (!open) return null;

	return (
		<DialogContext.Provider value={{ onOpenChange }}>
			{ReactDOM.createPortal(
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4"
					aria-modal="true"
					role="dialog"
				>
					<div
						className="fixed inset-0 bg-black/50 backdrop-blur-sm"
						onClick={() => onOpenChange(false)}
					/>
					{children}
				</div>,
				document.body
			)}
		</DialogContext.Provider>
	);
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div className={cn(
			"relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg",
			className
		)}>
			{children}
		</div>
	);
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
	return <div className="mb-2">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
	return <h3 className="text-lg font-semibold">{children}</h3>;
}


