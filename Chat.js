// [disable:false]
// [rule: ai?]
// [rule: AI?]
// [author: Suwanya]
// [class: 娱乐类]
// [public: true]
// [price: 0.05]
// [service: https：//suwanya.cn]
// [description: 基于GPT3.5的AI聊天机器人，无需配置代理，无需APIKey，aisystem命令可以查看人设，aires命令可以刷新会话，aidata命令可以查看历史会话，aitalk可以进入连续对话模式，对每个用户有独立记忆]

// 将用户输入的第一个参数进行URL编码，并赋值给变量param1
let Word = encodeURI(param(1));

// 使用Switch语句，根据Word的值执行不同的操作
switch (Word) {
    // 如果用户输入"system"，发送gptsystem的值
    case "system":
        sendText(get("gptsystem"));
        break;

    // 如果用户输入"res"，发送一个HTTP请求并返回提示
    case "res":
        // 创建URL字符串
        let resURL = `http://suwanya.f3322.net:9920/api/?reset=true&key=${GetUserID()}&system=${get("gptsystem")}&cook=${get("gpttoken")}`;
        // 发送HTTP请求并返回提示
        sendText('重置成功了哦！System也写入成功了！System返回：');
        sendText(request({ url: resURL }));
        break;

    // 如果用户输入"data"，发送一个HTTP请求并将响应结果发送出去
    case "data":
        // 创建URL字符串
        let DataURL = `http://suwanya.f3322.net:9920/api/Data/${GetUserID()}.json`;
        // 发送HTTP请求并将响应结果发送出去
        request({ url: DataURL }, (error, response) => {
            if (!error && response.statusCode == 200) {
                sendText(request({ url: DataURL }));
            } else if (response.statusCode == 404) {
                sendText("没有查询到您的历史聊天记录！");
            } else if (error) {
                sendText("发生错误: " + error.message);
            } else {
                sendText("发生错误，状态码: " + response.statusCode);
            }
        });
        break;
    
    // 如果用户输入"talk"，执行一系列的操作，包括持续和用户对话直到用户输入"q"或者超时
    case "talk":
        // 定义一个函数，用于处理用户的输入和发送HTTP请求
        const talkFunction = function () {
            // 获取用户的输入，最多等待60000毫秒
            let userInput = input(60000);
            // 如果用户没有输入，发送一条提示信息
            if (!userInput) {
                sendText("超过60秒没有和我对话了呢，我就先退下啦");
                // 如果用户输入"q"，发送一条提示信息
            } else if (userInput == 'q') {
                sendText("已经退出了哦！");
                // 处理用户的输入
            } else {
                // 创建URL字符串
                let WordURL = `http://suwanya.f3322.net:9920/api/?key=${GetUserID()}&word=${userInput}&cook=${get("gpttoken")}`;
                // 发送HTTP请求并获取响应
                let Response = request({ url: WordURL });
                sendText(Response);
                // 再次调用talkFunction函数，实现持续对话
                talkFunction();
            }
        }

        // 提示用户是否要进入连续对话模式
        sendText("确定进入连续对话模式吗？\n1.确定\n2.取消");
        // 获取用户的选择，最多等待30000毫秒
        let c = input(30000);
        // 如果用户没有选择，发送一条提示信息
        if (!c) {
            sendText("超过30秒没有选择，我先退下啦");
            // 如果用户选择进入连续对话模式，发送一条提示信息并开始连续对话
        } else if (c == 1 || c == '确定' || c == '1.确定') {
            sendText("已进入连续对话模式,超过60秒不理我,我就会自动退出哦\n\n回复q即可退出哦！");
            talkFunction();
            // 如果用户选择取消，发送一条提示信息
        } else if (c == 2 || c == '取消' || c == '2.取消') {
            sendText("已取消！");
        }
        break;

    // 如果用户输入其他的值，发送一个HTTP请求并将响应结果发送出去
    default:
        // 创建URL字符串
        let defaultWordURL = `http://suwanya.f3322.net:9920/api/?key=${GetUserID()}&word=${Word}&cook=${get("gpttoken")}`;
        // 发送HTTP请求并获取响应
        let defaultResponse = request({ url: defaultWordURL });
        sendText(defaultResponse);
        break;
}