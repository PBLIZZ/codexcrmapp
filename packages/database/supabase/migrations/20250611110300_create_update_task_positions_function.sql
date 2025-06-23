-- Create function to update task positions
CREATE OR REPLACE FUNCTION update_task_positions(task_positions jsonb)
RETURNS void AS $$
DECLARE
  task_id UUID;
  position INTEGER;
  task_record RECORD;
BEGIN
  FOR task_record IN SELECT * FROM jsonb_to_recordset(task_positions) AS x(id UUID, position INTEGER)
  LOOP
    task_id := task_record.id;
    position := task_record.position;
    
    UPDATE tasks
    SET position = position,
        updated_at = now()
    WHERE id = task_id
    AND user_id = auth.uid();
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;