/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, Checkbox, DatePicker, Form, Input, Select, TreeSelect } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSaveContext } from '@/components/SaveContext';
import { thongTinTaiSanSchema, YupValidator } from '../schema/schema'
import { countries } from '@/data/diachi'
import { mockNhomTaiSanList } from '@/data/nhomTaiSan'
import BoPhanSuDung from './modals/BoPhanSuDung';
import dayjs from 'dayjs';
import { boPhanSuDung, mockBoPhanSuDung } from '@/data/boPhanSuDung';
import CoDat from './modals/CoDat';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TTTS {

}

interface option {
  title: string | number;
  value: string | number;
}

const ThongTinTaiSan: React.FC<TTTS> = () => {
  const [form] = Form.useForm();
  const [checked, setChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coDatOpen, setCoDatOpen] = useState(false);

  const [boPhanList, setBoPhanList] = useState<boPhanSuDung[]>(mockBoPhanSuDung);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openCoDatModal = () => setCoDatOpen(true);
  const closeCoDatModal = () => setCoDatOpen(false);
  const [tinhDropdown, setTinhDropdown] = useState<option[]>([]);
  const [selectedTinh, setSelectedTinh] = useState<number | null>(null);
  const [selectedHuyen, setSelectedHuyen] = useState<number | null>(null);

  const [huyenOptions, setHuyenOptions] = useState<option[]>([]);
  const [xaOptions, setXaOptions] = useState<option[]>([]);
  const [taiSanOptions, setTaiSanOptions] = useState<option[]>([]);
  const { updateSharedField } = useSaveContext();


  const { registerForm } = useSaveContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const yupSync = YupValidator(thongTinTaiSanSchema, form.getFieldsValue);

  useEffect(() => {
    registerForm("ThongTinTaiSan", form, validateOnly, handleSubmit);
  }, []);

  useEffect(() => {
    const tinhh = countries
      .filter((i: any) => i.level === "tinh")
      .map((i: any) => ({
        title: i.name,
        value: i.countryId,
      }));
    setTinhDropdown(tinhh);

    const taisann = mockNhomTaiSanList.map((i: any) => ({
      title: i.nhomTaiSan,
      value: i.maNhomTaiSan,
    }));
    setTaiSanOptions(taisann)

  }, []);

  const handleCheckboxChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setChecked(e.target.checked);
  };


  //chọn tỉnh
  const handleTinhChange = (value: number) => {
    setSelectedTinh(value);
    setSelectedHuyen(null);        // reset state huyện
    setXaOptions([]);              // reset xã options

    form.setFieldsValue({
      huyen: null,
      xa: null,
    });

    const filteredHuyen = countries
      .filter((item) => item.level === "huyen" && item.parentId === value)
      .map((item) => ({
        title: item.name,
        value: item.countryId,
      }));

    setHuyenOptions(filteredHuyen);
  };

  //chọn huyện:
  const handleHuyenChange = (value: number) => {
    setSelectedHuyen(value);

    form.setFieldsValue({
      xa: null,
    });

    const filteredXa = countries
      .filter((item) => item.level === "xa" && item.parentId === value)
      .map((item) => ({
        title: item.name,
        value: item.countryId,
      }));

    setXaOptions(filteredXa);
  };


  const handleThemBoPhanSuDung = (newBoPhan: boPhanSuDung) => {
    setBoPhanList((prev) => [...prev, newBoPhan]);
  };


  const validateOnly = async () => {
    try {
      const values = await form.validateFields();
      console.log("validate from Thongtintaisan:", values);
      return true
    } catch (err) {
      console.log("Validation failed:", err);
      return false
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Lấy giá trị theo mức độ ưu tiên: xa > huyen > tinh
      const selectedCountryId = values.xa || values.huyen || values.tinh;

      // Gán countryId vào form để map với hidden field
      form.setFieldsValue({ coutryId: selectedCountryId });

      // Xoá các trường không cần gửi đi
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tinh, huyen, xa, ...filteredValues } = values;
      filteredValues.coutryId = selectedCountryId;

      console.log("Submitted from Thongtintaisan:", filteredValues);

      // Gọi API ở đây nếu cần
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };



  return (

    <>
      <Form
        form={form}

        onFinish={handleSubmit}
        labelCol={{ span: 4 }}

      >
        <div
          className="border border-gray-400 p-2 rounded-md"
        >
          <h1>
            thông tin tài sản
          </h1>


          {/* đơn vị sử dụng */}
          <div className="flex gap-2">
            <Form.Item
              label={
                <span>
                  Đơn Vị Sử Dụng
                  <span className="text-red-500 ml-0.5 text-xs">*</span>
                </span>
              }
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 24 }}
              name="maDonVi"
              rules={[yupSync]}
              initialValue={"T55002002"}
              className="flex-2"
              labelAlign="left"
            >
              <Input
                disabled
                placeholder="T55002002"
              />
            </Form.Item>
            <Form.Item
              name="tenDonVi"
              rules={[yupSync]}
              initialValue={"Nhà khách văn phòng UBND tỉnh Thái Nguyên"}
              className="flex-[3]"
            >
              <Input
                disabled
                placeholder="Nhà khách văn phòng UBND tỉnh Thái Nguyên" />
            </Form.Item>
          </div>

          {/* mã tên tài sản */}
          <div className="flex gap-2">
            <Form.Item
              label={
                <span>
                  Mã/Tên tài sản
                  <span className="text-red-500 ml-0.5 text-xs">*</span>
                </span>
              }
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 24 }}
              name="maTaiSan"
              rules={[yupSync]}
              className="flex-2"
              labelAlign="left"
            >
              <Input
                disabled
                placeholder="Mã tự sinh" />
            </Form.Item>
            <Form.Item
              name="tenTaiSan"
              rules={[yupSync]}
              className="flex-[3]"
            >
              <Input
                placeholder="tên tài sản" />
            </Form.Item>
          </div>

          {/* có đất */}
          <Form.Item
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            label={<span>&nbsp;</span>}
            colon={false}
          >
            <Checkbox
              onChange={handleCheckboxChange}

            >
              có đất
            </Checkbox>


          </Form.Item>
          {checked && (
            <Form.Item
              label={
                <span>
                  Thuộc khuôn viên đất
                  <span className="text-red-500 ml-0.5 text-xs">*</span>
                </span>
              }
              name="thuocKhuonVienDat"
              rules={[yupSync]}
              className="w-full"
              labelCol={{ span: 4 }}  // Điều chỉnh độ rộng của label
              wrapperCol={{ span: 20 }}  // Điều chỉnh độ rộng của phần chứa input
              labelAlign="left"
            >
              <div className="flex gap-2 w-20/48">
                <Input
                  multiple
                  placeholder=""
                  className="flex-1"
                  disabled
                />
                <Button onClick={openCoDatModal}>
                  <PlusCircleOutlined />
                  <span>chọn đất</span>
                </Button>

              </div>
            </Form.Item>

          )}

          {/* thành phố */}

          <Form.Item
            name='coutryId'
            hidden
          >

          </Form.Item>
          <div
            className="flex gap-2"
          >
            <div className='flex-4'>

              <Form.Item
                label={
                  <span>
                    Thành Phố
                    <span className="text-red-500 ml-0.5 text-xs">*</span>
                  </span>
                }
                className="w-full"
                labelCol={{ span: 24 }}  // Điều chỉnh độ rộng của label
                wrapperCol={{ span: 24 }}  // Điều chỉnh độ rộng của phần chứa input
                labelAlign="left"
              >

              </Form.Item>
            </div>

            <div className='flex-7'>
              <Form.Item
                name="tinh"
                rules={[yupSync]}
                className="flex-4"
                //labelCol={{ span: 8 }}  // Điều chỉnh độ rộng của label
                //wrapperCol={{ span: 24 }}  // Điều chỉnh độ rộng của phần chứa input
                labelAlign="left"
              >
                <TreeSelect
                  style={{ width: '100%' }}
                  variant="outlined"
                  placeholder="chọn Tỉnh"
                  //className="flex"
                  treeData={tinhDropdown}
                  onChange={handleTinhChange}
                />
                {/* Huyện */}
              </Form.Item >
            </div>

            <div className='flex-7'>
              {selectedTinh && (
                <Form.Item
                  name="huyen"
                  className="flex-2"
                  labelAlign="left"
                >
                  <TreeSelect
                    placeholder='chọn thành phố/huyện'
                    className="flex-1"
                    treeData={huyenOptions}
                    onChange={handleHuyenChange}
                  />
                </Form.Item>
              )}
            </div>

            <div className='flex-7'>
              {selectedHuyen && (
                <Form.Item
                  name="xa"
                  className="flex-2"
                  labelAlign="left"
                >
                  <TreeSelect
                    placeholder='Chọn phường/xã'
                    className="flex-1"
                    treeData={xaOptions}
                  />
                </Form.Item>
              )}

            </div>
            {/* XÃ */}


          </div>

          {/* ngày đưa vào sd */}
          <div className="flex w-full gap-4">
            {/* Form Item 1 */}
            <Form.Item
              label={
                <span>
                  Ngày đưa vào sử dụng
                  <span className="text-red-500 ml-0.5 text-xs">*</span>
                </span>
              }
              name="ngayDuaVaoSuDung"
              rules={[yupSync]}
              className="flex-1"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign="left"

            >
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                placeholder='DD/MM/YYYY'
                disabledDate={(current) => {
                  return current && current >= dayjs().startOf('day'); // Chặn chọn từ hôm nay trở đi
                }}
                onChange={(value) => {
                  if (!value) {
                    updateSharedField("ngayDuaVaoSuDung", null);
                    return;
                  }

                  if (value.isBefore(dayjs(), "day")) {
                    updateSharedField("ngayDuaVaoSuDung", value);
                  } else {
                    alert("Ngày đưa vào sử dụng phải nhỏ hơn ngày hiện tại.");
                    //updateSharedField("ngayDuaVaoSuDung", null); // Reset hoặc giữ nguyên tuỳ bạn
                  }
                }}
              />

            </Form.Item>

            {/* Form Item 2 */}
            <Form.Item
              label={
                <span>
                  Năm xây dựng
                  <span className="text-red-500 ml-0.5 text-xs">*</span>
                </span>
              }
              name="namXayDung"
              rules={[yupSync]}
              className="flex-1"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign="left"
            >

              <Input
                placeholder='nhập năm xây dựng'
                //disabled 
                className="w-full"
              />
            </Form.Item>
          </div>

          {/* nhóm tài sản */}

          <div className="flex gap-2 w-full">

            <Form.Item
              label={
                <span>
                  nhóm tài sản
                  <span className="text-red-500 ml-0.5 text-xs">*</span>
                </span>
              }
              name="maNhomTaiSan"
              className="flex-3"
              labelCol={{ span: 8 }}  // Điều chỉnh độ rộng của label
              wrapperCol={{ span: 24 }}  // Điều chỉnh độ rộng của phần chứa input
              labelAlign="left"
            >
              <Input
                placeholder='Mã tự sinh khi chọn nhóm tài sản'
                disabled
              //className="flex-1"
              />

            </Form.Item>
            <Form.Item
              name="nhomTaiSan"
              rules={[yupSync]}
              className=" flex-[3]"
            //rules={[{ required: true, message: "Vui lòng chọn nhóm tài sản" }]}
            >
              <TreeSelect
                placeholder="Chọn nhóm tài sản"
                treeData={taiSanOptions}
                onChange={(value) => {
                  const maNhomTaiSan = value;
                  const maDonVi = form.getFieldValue("maDonVi");
                  form.setFieldsValue({
                    maNhomTaiSan: value, // value chính là mã tương ứng
                    maTaiSan: `${maDonVi}-${maNhomTaiSan}`,
                  });
                  updateSharedField("maNhomTaiSan", value)
                }}

              />
            </Form.Item>

          </div>

          {/* phê duyệt quyết toán */}
          <Form.Item
            label={
              <span>
                phê duyệt quyết toán
                <span className="text-red-500 ml-0.5 text-xs">*</span>
              </span>
            }
            name="pheDuyetQuyetToan"
            rules={[yupSync]}
            className="flex-1 w-1/2"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
          >
            <Select
              className="w-full"
              placeholder="Chọn trạng thái"
              options={[
                { label: 'Đã được phê duyệt quyết toán', value: 1 },
                { label: 'Chờ phê duyệt', value: 2 },
                { label: 'Từ chối', value: 3 },
              ]}
            />

          </Form.Item>

          {/* lí do tăng */}

          <Form.Item
            label={
              <span>
                lý do tăng
                <span className="text-red-500 ml-0.5 text-xs">*</span>
              </span>
            }
            name="lyDoTang"
            rules={[yupSync]}
            className="flex-1 w-1/2"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
          >
            <Select
              className="w-full"
              placeholder="Chọn trạng thái"
              options={[
                { label: 'được giao nhận điều chuyển', value: 1 },
                { label: 'something..', value: 2 },
                { label: 'something...', value: 3 },
              ]}
            />

          </Form.Item>

          {/* Mục đích sử dụng */}

          <Form.Item
            label={
              <span>
                Mục đích sử dụng
                <span className="text-red-500 ml-0.5 text-xs">*</span>
              </span>
            }
            name="mucDichSuDung"
            rules={[yupSync]}
            className="flex-1 w-2/3"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
          >
            <Select
              className="w-full"
              placeholder="Chọn trạng thái"
              options={[
                { label: 'Quản lý nhà nước', value: 1 },
                { label: 'something..', value: 2 },
                { label: 'something...', value: 3 },
              ]}
            />

          </Form.Item>


          {/* Bộ phận sử dụng */}

          <Form.Item
            label={
              <span>
                bộ phận sử dụng
                <span className="text-red-500 ml-0.5 text-xs">*</span>
              </span>
            }
            name="boPhanSuDung"
            className="flex-1 w-2/3 "
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
          >
            <div
              className="flex flex-row gap-2">

              <Select
                className="w-full"
                placeholder="Chọn bộ phận sử dụng"
                options={boPhanList.map((bp) => ({
                  label: bp.tenBoPhanSuDung,
                  value: bp.maBoPhanSuDung,
                }))}
              />
              <Button onClick={openModal}>
                <PlusCircleOutlined />
              </Button>
            </div>

          </Form.Item>

          {/* Tình trạng sử dụng */}

          <Form.Item
            label={
              <span>
                Tình trạng sử dụng
                <span className="text-red-500 ml-0.5 text-xs">*</span>
              </span>
            }
            name="tinhTrangSuDung"
            className="flex-1 w-2/3"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
          >
            <Select
              className="w-full"
              placeholder="Chọn tình trạng"
              options={[
                { label: 'đang sử dụng', value: 1 },
                { label: 'đã giải thể', value: 2 },
                { label: 'đang xây dựng', value: 3 },
              ]}
            />

          </Form.Item>


        </div>

      </Form>
      <BoPhanSuDung
        open={isModalOpen}
        onClose={closeModal}
        onAdd={handleThemBoPhanSuDung}
      />

      <CoDat
        open={coDatOpen}
        onClose={closeCoDatModal}
      />
    </>
  )
}

export default ThongTinTaiSan
