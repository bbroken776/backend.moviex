export default function responseHelper(statusCode: number, message: string, data?: { [key: string]: any }) {
  const response: any = {
    status: statusCode,
    message: message,
  };

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      response[key] = value;
    }
  }

  return response;
}
