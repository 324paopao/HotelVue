import request from "@/utils/request";
import axios from "axios";

const FileAPI = {
  /**
   * 上传文件
   *
   * @param formData
   */
  upload(formData: FormData) {
    return request.httpRequest<any, FileInfo>({
      url: "/api/v1/files",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * 上传文件
   */
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append("files", file);
    // 使用axios直接发送请求，确保正确解析返回值
    return axios.post("/api/FileImg", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then((response) => {
      // 确保返回正确的数据结构
      return {
        filePaths: response.data.filePaths || [response.data.filePath] || [`/uploads/${file.name}`]
      };
    });
  },

  /**
   * 删除文件
   *
   * @param filePath 文件完整路径
   */
  delete(filePath?: string) {
    return request.httpRequest({
      url: "/api/v1/files",
      method: "delete",
      params: { filePath },
    });
  },

  /**
   * 下载文件
   * @param url
   * @param fileName
   */
  download(url: string, fileName?: string) {
    return request.httpRequest({
      url,
      method: "get",
      responseType: "blob",
    }).then((res) => {
      const blob = new Blob([res.data]);
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName || "下载文件";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  },
};

export default FileAPI;

/**
 * 文件API类型声明
 */
export interface FileInfo {
  /** 文件名 */
  name?: string;
  /** 文件路径 */
  url?: string;
  /** 文件路径（服务器返回） */
  filePath?: string;
  /** 文件路径数组（服务器返回） */
  filePaths?: string[];
}
