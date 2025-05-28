/* eslint-disable @typescript-eslint/no-explicit-any */
import { coDat, mockCoDat } from '@/data/coDat'
import { Button, Form, Modal, Select, Table, TableProps } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'



interface DataType {
  key: React.Key
  maTaiSan: string
  tenTaiSan: string
  nhomTaiSan: string
  ngaySuDung: string

}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CoDatFormProps {
  open: boolean;
  onClose: () => void;
  setDat: (dat: coDat) => void;
}
const CoDat: React.FC<CoDatFormProps> = ({ open, onClose, setDat }) => {
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataTable, setDataTable] = useState<DataType[]>([]);

  //const [maxPage, setMaxPage] = useState(1);


  const columns: TableProps<DataType>['columns'] = useMemo(
    () => [
      {
        title: <span className="text-blue-600 font-bold ">STT</span>,
        dataIndex: 'key',
        key: 'key',

        render: (_: any, __: any, index: number) => {
          return <>{(currentPage - 1) * pageSize + index + 1}</>
        },
        align: 'center' as const,
        width: '10%',
      },
      {
        title: <span className="text-blue-600 font-bold">Mã Tài Sản</span>,
        dataIndex: 'maTaiSan',
        key: 'maTaiSan',
        align: 'center' as const,
        width: '20%',
      },
      {
        title: <span className="text-blue-600 font-bold">Tên tài sản</span>,
        dataIndex: 'tenTaiSan',
        key: 'tenTaiSan',
        align: 'center' as const,
        width: '30%',
      },
      {
        title: <span className="text-blue-600 font-bold">Nhóm tài sản</span>,
        dataIndex: 'nhomTaiSan',
        key: 'nhomTaiSan',
        align: 'center' as const,
        width: '20%',
      },
      {
        title: <span className="text-blue-600 font-bold">Ngày sử dụng</span>,
        dataIndex: 'ngaySuDung',
        key: 'ngaySuDung',
        align: 'center' as const,
        width: '20%',
      },

    ], [currentPage, pageSize]
  )

  const coDatToDataTable = (data: coDat[]): DataType[] => {
    return data.map((item) => ({
      ...item,
      key: item.maTaiSan, // hoặc có thể dùng uuid nếu cần key phức tạp hơn
    }));
  };


  // Khi có dữ liệu coDat:
  useEffect(() => {
    setDataTable(coDatToDataTable(mockCoDat));
  }, []);


  const handleRowClick = (record: DataType) => {

    const con = confirm('bạn có chắc muốn chọn mảnh đất ' + record.tenTaiSan + " chứ ?")
    if (con === true) {
      setDat(record)
      onClose()
    }

  };

  const handleTimKiem = () => {
    const keyWord = form.getFieldValue("nhomTaiSan")
    if (keyWord != undefined) {
      const Data = mockCoDat.filter(i => i.nhomTaiSan == keyWord)
      const newData = coDatToDataTable(Data)
      setDataTable(newData)
    }


    //console.log(mockCoDat.map(i => i.nhomTaiSan))
  };

  const handleReSet = () => {
    form.resetFields()
    const newData = coDatToDataTable(mockCoDat)
    setDataTable(newData)
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={'chọn đất'}
      footer={null}
      width={800}
    >
      <div>

        <Form
          form={form}
        >
          <Form.Item
            label={
              <span>
                chọn nhóm tài sản
                <span className="text-red-500 ml-0.5 text-xs">*</span>
              </span>
            }
            name="nhomTaiSan"
            className='w-full'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
          >
            <Select
              options={mockCoDat.map(i => i.nhomTaiSan).map(i => (
                {
                  label: i,
                  value: i
                }))}
            />
          </Form.Item>
          <div className='float-right mb-5 flex gap-2'>

            <Button onClick={handleTimKiem}>Tìm kiếm</Button>
            <Button onClick={handleReSet}>reset</Button>
          </div>

        </Form>

      </div>

      <Table<DataType>
        bordered
        rowKey="maTaiSan"
        dataSource={dataTable.length > 0 ? dataTable : []}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () => handleRowClick(record), // Gán sự kiện click vào mỗi row
          };
        }}
      >


      </Table>

    </Modal>
  )
}



export default CoDat