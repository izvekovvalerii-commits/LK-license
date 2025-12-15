-- Add workflow fields to tasks table
ALTER TABLE tasks ADD COLUMN parent_task_id BIGINT;
ALTER TABLE tasks ADD COLUMN subtask_type VARCHAR(30);
ALTER TABLE tasks ADD COLUMN planned_start_date DATE;
ALTER TABLE tasks ADD COLUMN planned_end_date DATE;
ALTER TABLE tasks ADD COLUMN actual_start_date DATE;
ALTER TABLE tasks ADD COLUMN actual_end_date DATE;

-- Add foreign key constraint for parent task
ALTER TABLE tasks ADD CONSTRAINT fk_parent_task 
    FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX idx_parent_task_id ON tasks(parent_task_id);
CREATE INDEX idx_subtask_type ON tasks(subtask_type);
