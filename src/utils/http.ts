export default function http(url: string) {
  return new Promise((resolve, reject) => {
    window
      .fetch(url)
      .then(async response => {
        const data = await response.json();

        if (response.ok) {
          return data;
        } else {
          // 注意这里需要手动reject出错误，否则在fetch().catch中捕获不到status为401、500等异常。
          return Promise.reject(data);
        }
      })
      .then(json => {
        resolve(json);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}
