import request from "@/utils/request";

/**
 * 上传文件到后端
 * @param {FormData} formData - 包含 files 字段的 FormData 对象
 * @returns {Promise<any>}
 */
export function uploadFile(data: any) {
  return request.httpRequest({
    url: `api/FileImg`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
