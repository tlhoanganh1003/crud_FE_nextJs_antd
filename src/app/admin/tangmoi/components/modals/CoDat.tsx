import { Modal } from 'antd'
import React from 'react'




// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CoDatFormProps {
  open: boolean;
  onClose: () => void;

}
const CoDat: React.FC<CoDatFormProps> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={'Thêm Bộ phận sử dụng'}
      footer={null}
      width={800}
    >

    </Modal>
  )
}



export default CoDat