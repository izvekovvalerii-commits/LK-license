import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Col } from 'antd';

interface SortableTileProps {
    id: string;
    children: React.ReactNode;
}

export const SortableTile: React.FC<SortableTileProps> = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        height: '100%',
    };

    return (
        <Col
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            xs={24} sm={12} md={8} lg={4}
        >
            {children}
        </Col>
    );
};
