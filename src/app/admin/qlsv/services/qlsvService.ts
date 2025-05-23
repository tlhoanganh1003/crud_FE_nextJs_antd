/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"



class Services {

  getListKhoa = async () => {
    return await axios.get(`http://localhost:5015/api/khoas`)
  }

  getListSinhVien= async (pageNo: number,pageSize:number) => {
    return await axios.get(`http://localhost:5015/api/sinhViens`, {
      params: { pageNo, pageSize },
    })
  }

  findListSinhVienByTenSV= async (pageNo: number,pageSize:number,tenSinhVien:string) => {
    return await axios.get(`http://localhost:5015/api/sinhViens/search`, {
      params: { pageNo, pageSize, tenSinhVien },
    })
  }

  createSinhVien = async (sinhVienData: any) => {
    const response = await axios.post(
      `http://localhost:5015/api/sinhViens/createSinhVien`,
      sinhVienData
    );
    return response.data;
  }

  updateSinhVien = async (sinhVienUpdateData: any) => {
      const response = await axios.patch(`http://localhost:5015/api/sinhViens/updateSinhVien`, 
        sinhVienUpdateData
      )
      return response.data;
  }

  deleteSinhVien = async ( maSinhVien :string)=>{

      const response = await axios.delete(`http://localhost:5015/api/sinhViens/delete/${maSinhVien}`)
      return response.data

  }

  deleteListSinhVien = async (ListmaSinhVien: string[]): Promise<any> => {
    try {
      const response = await axios.delete(
        `http://localhost:5015/api/sinhViens/deleteListSinhVien`, 
        {
          data: ListmaSinhVien, // Truyền trực tiếp mảng
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa danh sách sinh viên:", error);
      throw error;
    }
  }



}

const qlsvServices = new Services()

export {qlsvServices}
