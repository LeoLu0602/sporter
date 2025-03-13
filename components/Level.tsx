import clsx from 'clsx';
import { MouseEventHandler } from 'react';

export default function Level({
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
            className={clsx('border-[1px] w-8 h-8 rounded-full', {
                'bg-emerald-500 border-emerald-500':
                    level === index && level > 0,
                'bg-rose-500 border-rose-500': level === index && level === 0,
                'bg-white border-[#aaa]': level !== index,
            })}
            onClick={handleClick}
        />
    );
}
