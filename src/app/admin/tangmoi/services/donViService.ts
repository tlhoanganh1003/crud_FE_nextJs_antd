/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"

class Services {
getAllDonVi = async () => {
    return await axios.get(`http://localhost:5015/api/donVi/all`)
  }

}


const donViServices = new Services()

export {donViServices}