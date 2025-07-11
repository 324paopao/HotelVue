//import request from "@/utils/request";

/**
 * 上传文件到后端
 * @param {FormData} formData - 包含 files 字段的 FormData 对象
 * @returns {Promise<any>}
 */
export function uploadFile(formData: FormData) {
  return {
    url: "http://8.152.98.56:8080/api/FileImg",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
}
