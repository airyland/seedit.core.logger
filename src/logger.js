/**
 * 前端错误监控
 * 收集`javascript`错误并用`beacon`的方式保存到`seedit.duapp.com`上的数据库
 * @author airyland <i@mao.li>
 */

(function() {
    var seedlogger = {
        toQueryString: function(o) {
            var res = [],
                p, encode = encodeURIComponent;
            for (p in o) {
                if (o.hasOwnProperty(p)) res.push(encode(p) + '=' + encode(o[p]));
            }
            return res.join('&');
        },
        beacon: function(msg) {
            if (this.server) {
                var img = new Image();
                img.src = this.server + '?' + msg;
            }
        },
        report: function(info) {
            seedlogger.beacon(seedlogger.toQueryString(info));
        },
        init: function(server) {
            if (server) {
                this.server = server;
            }
            // 自动捕获window.onerror
            window.onerror = function(msg, url, line) {
                seedlogger.report({
                    from: document.location.href,
                    msg: msg,
                    url: url,
                    line: line,
                    type: 'onerror',
                });
            };
            return this;
        },
        runMethod: function(method) {
            try {
                method();
            } catch (ex) {
                seedlogger.log({
                    from: document.location.href,
                    msg: ex.message,
                    type: 'try-catch'
                });
            }
        }
    };
    seedit.logger = seedlogger;
})(jQuery, seedit)