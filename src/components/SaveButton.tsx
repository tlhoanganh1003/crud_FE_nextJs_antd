import React from 'react'
import { useSaveContext  } from './SaveContext';
import { Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

export const SaveButton = () => {
  const { triggerSave } = useSaveContext ();
  return (
    <div className="mt-2">
      <Button type="primary" onClick={triggerSave}>
        <SaveOutlined />
        <span>Lưu</span>
      </Button>
    </div>
  )
}
