import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HolderOutlined } from '@ant-design/icons';

interface SortableWidgetProps {
    id: string;
    children: React.ReactNode;
    useDragHandle?: boolean;
}

export const SortableWidget: React.FC<SortableWidgetProps> = ({ id, children, useDragHandle = true }) => {
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
        marginBottom: 24,
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className="dashboard-widget-container">
            {useDragHandle && (
                <div
                    {...attributes}
                    {...listeners}
                    style={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        cursor: 'grab',
                        zIndex: 10,
                        padding: '4px 12px',
                        background: 'rgba(0,0,0,0.05)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0, // Hidden by default, shown on hover of parent
                        transition: 'opacity 0.2s',
                    }}
                    className="drag-handle"
                >
                    <HolderOutlined style={{ color: '#8c8c8c' }} />
                </div>
            )}
            {children}
        </div>
    );
};
