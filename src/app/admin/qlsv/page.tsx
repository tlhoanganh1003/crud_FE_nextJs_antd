/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button, Popconfirm, Table, TableProps } from 'antd';

import { useEffect, useMemo, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation'
import QlsvForm from './_component/qlsvForm';
import { DeleteOutlined, EditOutlined, EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { qlsvServices } from './services/qlsvService';
import QlsvSearch from './_component/qlsvSearch';


interface DataType {
  key: React.Key;
  maSinhVien: string;
  tenSinhVien: string;
  gioiTinh: string;
  ngaySinh: string; // nên là string vì lấy từ API, nếu muốn định dạng thì format về sau
  tenKhoa: string;
}

export default function Qlsv() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const [keySearch, setKeySearch] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataTable, setDataTable] = useState<DataType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [initialData, setInitialData] = useState<DataType>()
  const [reload, setReload] = useState(0)



  const mode = searchParams.get('mode') as 'create' | 'edit' | 'view';


  useEffect(() => {
    setOpen(!!mode); // nếu có mode => mở modal
  }, [mode]);

  const handleOpen = (newMode: 'create' | 'edit' | 'view', record?: DataType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', newMode);
    if (record) {
      params.set('id', record.maSinhVien); // hoặc bất cứ field nào bạn muốn
      // bạn có thể set thêm nhiều field nếu cần
    }
    router.push(`?${params.toString()}`);
  };





  useEffect(() => {
    if (keySearch == '') {
      fetchData(currentPage, pageSize)

    } else {
      fetchDataByTenSinhVien(currentPage, pageSize, keySearch)
    }

  }, [currentPage, pageSize, reload, keySearch]);

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
        width: '5%',
        
      },
      {
        title: <span className="text-blue-600 font-bold">Mã sinh viên</span>,
        dataIndex: 'maSinhVien',
        key: 'maSinhVien',
        align: 'center' as const,
        width: '10%',
      },
      {
        title: <span className="text-blue-600 font-bold">Tên sinh viên</span>,
        dataIndex: 'tenSinhVien',
        key: 'tenSinhVien',
        align: 'center' as const,
        width: '20%',
      },
      {
        title: <span className="text-blue-600 font-bold">Giới tính</span>,
        dataIndex: 'gioiTinh',
        key: 'gioiTinh',
        align: 'center' as const,
        width: '10%',
      },
      {
        title: <span className="text-blue-600 font-bold">Ngày Sinh</span>,
        dataIndex: 'ngaySinh',
        key: 'ngaySinh',
        align: 'center' as const,
        width: '20%',
      },
      {
        title: <span className="text-blue-600 font-bold">Khoa</span>,
        dataIndex: 'tenKhoa',
        key: 'tenKhoa',
        align: 'center' as const,
        width: '15%',
      },
      {
        title: <span className="text-blue-600 font-bold">Thao tác</span>,
        align: 'center' as const,
        render: (_: any, record: DataType) => (
          <div className="flex items-center justify-center gap-3 text-lg">
            <EyeOutlined
              className="cursor-pointer"
              onClick={() => {
                setInitialData(record)
                handleOpen('view', record)

              }}
            />
            <EditOutlined
              className="cursor-pointer"
              onClick={() => {
                setInitialData(record)
                handleOpen('edit', record)
              }}
            />
            <Popconfirm
              title="Delete the task"
              description="bạn có chắc muốn xóa sinh viên này?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDeleteSinhVien(record.maSinhVien)}
            >
              <DeleteOutlined className="cursor-pointer" />
            </Popconfirm>
          </div>
        ),
      },
    ],
    [currentPage, pageSize]
  );

  const fetchData = async (pageNo: number, pageSize: number) => {
    try {
      const response = await qlsvServices.getListSinhVien(pageNo, pageSize)
      // console.log(response.data);
      setDataTable(response.data.data);
      setMaxPage(response.data.maxPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchDataByTenSinhVien = async (pageNo: number, pageSize: number, tenSinhVien: string) => {
    try {
      const response = await qlsvServices.findListSinhVienByTenSV(pageNo, pageSize, tenSinhVien)
      // console.log(response.data);
      setDataTable(response.data.data);
      setMaxPage(response.data.maxPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('mode')
    params.delete('id')
    router.push(`?${params.toString()}`)
    setInitialData(undefined)
    setOpen(false)
    setReload(prev => prev + 1)

  };

  const rowSelection: TableProps<DataType>['rowSelection'] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleDeleteSinhVien = async (maSinhVien: string) => {
    const res = await qlsvServices.deleteSinhVien(maSinhVien)
    setReload(prev => prev + 1)
    return res
  }

  const handleDeleteListSinhVien = async () => {
    try {
      //console.log(selectedRowKeys)
      
      const stringKeys = selectedRowKeys.map((key) => String(key));
      if(stringKeys.length==0) {
        alert('mời chọn những sinh viên muốn xóa')
        return
      }
      const xacNhan = confirm(`bạn có muốn xóa ${stringKeys.length} sinh viên không?`)
      if (!xacNhan) return
      const res = await qlsvServices.deleteListSinhVien(stringKeys)
      setReload(prev => prev + 1)
      return res
    } catch (error) {
      console.error('Error fetching data:', error);
    }


  }




  return (
    <div className="flex flex-col columns-xs">
      <QlsvSearch setKey={setKeySearch} />
      <div className="text-xl mb-2">Danh sách sinh viên</div>
      <Table<DataType>
        bordered
        rowKey="maSinhVien"
        dataSource={dataTable.length > 0 ? dataTable : []}
        loading={loading}
        columns={columns}
        rowSelection={rowSelection}
        //scroll={{ x: 'max-content', y: 55 * 10 }}
        title={() => (<div className="flex items-center justify-end gap-3">
          <Button type="primary" onClick={() => handleOpen('create')}>
            Thêm mới
          </Button>
          
          <Button type="primary" danger onClick={() => handleDeleteListSinhVien()}>Xóa hàng loạt</Button>
        </div>)}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: maxPage * pageSize,
          showSizeChanger: true,        // Cho phép chọn số phần tử mỗi trang
          pageSizeOptions: ['5', '10', '20', '50'],  // Các tuỳ chọn cho pageSize
          defaultPageSize: 10,
          showQuickJumper: true,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        className='bg-sky-100'
      />
      
      <QlsvForm
        open={open}
        onCancel={handleClose}
        mode={mode} // hoặc "view", "create"
        initialData={initialData}
      />
    </div>
  );
}
