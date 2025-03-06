import clsx from 'clsx';
import { MouseEventHandler } from 'react';

export default function LevelBar({
    index,
    levels,
    handleClick,
}: {
    index: number;
    levels: Set<number>;
    handleClick: MouseEventHandler<HTMLButtonElement>;
}) {
    return (
        <button
            className={clsx('border-black border-2 w-4 h-4 rounded-full', {
                'bg-emerald-500': levels.has(index),
                'bg-white': !levels.has(index),
            })}
            onClick={handleClick}
        />
    );
}
