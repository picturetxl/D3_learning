

## Ready for this

+ include : 
    ```js
    <script src="https://d3js.org/d3.v5.min.js"></script>
    ```

+ 由于svg文件 d3是通过http异步请求得到，所以要有http服务器
  ```js
    //安装官网推荐的终端http服务器
    npm install -g http-server
    //started:
    http-server /path/to/jsfolder
    
  ```

+ 访问与调试
  ```js
  //电脑端访问
  浏览器输入 http://localhost:8080
  //在同一个网络环境中，可以用手机进行访问
  在浏览器输入：http:启动的ip地址:8080
  ```

