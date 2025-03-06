import clsx from 'clsx';
import { MouseEventHandler } from 'react';

export default function LevelBar({
    index,
    level,
    handleClick,
}: {
    index: number;
    level: number;
    handleClick: MouseEventHandler<HTMLButtonElement>;
}) {
    return (
        <button
            className={clsx('border-black border-2 w-4 h-4 rounded-full', {
                'bg-emerald-500': level === index,
                'bg-white': level !== index,
            })}
            onClick={handleClick}
        />
    );
}
