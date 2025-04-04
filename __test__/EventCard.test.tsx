import EventCard from '@/components/EventCard';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('EventCard', () => {
    it('renders correct title', () => {
        render(
            <EventCard
                isOwner={false}
                sport="soccer"
                title="足球@台中一中"
                startTime={new Date(2025, 5, 3, 15)}
                endTime={new Date(2025, 5, 3, 18)}
                location="一中足球場"
                openCard={() => {}}
            />
        );

        const title = screen.getByTestId('title').textContent;

        expect(title).toBe('足球@台中一中');
    });
});
