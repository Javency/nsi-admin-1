layui.use(['table','form'], function(){
    var table = layui.table;
    var colsSetting = [
        {type:'checkbox',fixed:'left'}
        ,{field:'People_name', width:140, title: '姓名',align:'center',fixed:'left'}
        ,{field:'People_work', width:200,title: '工作单位', align:'center'} //minWidth：局部定义当前单元格的最小宽度，layui 2.2.1 新增
        ,{field:'People_position',width:180, title: '职位', sort: true,align:'center'}
        ,{field:'People_mail',width:180, title: '邮箱',align:'center'}
        ,{field:'People_address', width:180, title: '通讯地址',align:'center'}
        ,{field:'People_phone' ,width:140,title: '手机号码', align:'center'}
        ,{field:'People_telephone', width:150, title: '座机', align:'center'}
        ,{field:'People_wechat', width:137, title: '微信', align:'center'}
        ,{field:'People_introduction', width:150, title: '简介', align:'center'}
        ,{field:'People_remark', width:150, title: '备注', align:'center'}
        ,{field:'People_member', width:140, title: '会员类别', sort: true,align:'center'}
        ,{field:'People_dueTime', width:150, title: '会员到期时间',align:'center'}
        ,{field:'People_loadPeople', width:120, title: '提交人', sort: true,align:'center'}
        ,{field:'People_loadTime', width:160, title: '提交时间', align:'center'}
        ,{field:'People_id', width:80, title: 'ID', sort: true,align:'center'}
        ,{fixed: 'right',title:'操作', width:130, align:'center', toolbar: '#barCard'} //这里的toolbar值是模板元素的选择器
    ]
    var $ = layui.$
    console.log($(window).width())
    if( $(window).width() < 480){
        colsSetting = [
            {field:'People_name', width:140, title: '姓名',align:'center'}
            ,{field:'People_work', width:200,title: '工作单位', align:'center'} //minWidth：局部定义当前单元格的最小宽度，layui 2.2.1 新增
            ,{field:'People_position',width:180, title: '职位', sort: true,align:'center'}
            ,{field:'People_mail',width:180, title: '邮箱',align:'center'}
            ,{field:'People_address', width:180, title: '通讯地址',align:'center'}
            ,{field:'People_phone' ,width:140,title: '手机号码', align:'center'}
            ,{field:'People_telephone', width:150, title: '座机', align:'center'}
            ,{field:'People_wechat', width:137, title: '微信', align:'center'}
            ,{field:'People_introduction', width:150, title: '简介', align:'center'}
            ,{field:'People_remark', width:150, title: '备注', align:'center'}
            ,{field:'People_member', width:140, title: '会员类别', sort: true,align:'center'}
            ,{field:'People_dueTime', width:150, title: '会员到期时间',align:'center'}
            ,{field:'People_loadPeople', width:120, title: '提交人', sort: true,align:'center'}
            ,{field:'People_loadTime', width:160, title: '提交时间', align:'center'}
            ,{field:'People_id', width:80, title: 'ID', sort: true,align:'center'}
            ,{title:'操作', width:130, align:'center', toolbar: '#barCard'} //这里的toolbar值是模板元素的选择器
        ]
    }
    table.render({
        elem: '#cardShow'
        ,url:'http://'+changeUrl.address+'/People_api?whereFrom=search'
        ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        ,page:true
        // ,height:'full-150'
        ,request: { pageName: 'pageNum' ,limitName: 'OnePageNum'}
        ,limit:20
        ,id: 'renderReload'
        ,cols: [colsSetting]
    });
    //监听表格复选框选择
    table.on('checkbox(card)', function(obj){
        console.log(obj)
    });
    //监听工具条
    table.on('tool(card)', function(obj){
        var data = obj.data;
        if(obj.event === 'detail'){
            layer.msg('ID：'+ data.id + ' 的查看操作');
        } else if(obj.event === 'del'){
                layer.confirm('真的删除本条数据吗',{icon: 3, title:'系统提示'}, function(index){
                    $.ajax({
                        type: "get",
                        async: true,
                        data: {
                            "People_id":data.People_id
                        },//提交的参数
                        url: 'http://' + changeUrl.address + '/People_api?whereFrom=delete',
                        contentType: 'application/json;charset=UTF-8',
                        dataType: "json",//数据类型为json  
                        success: function (msg) {
                            console.log(msg)
                            if(msg.msg == 1){
                                layer.msg('删除成功')
                                obj.del();
                                layer.close(index);
                            }
                        },
                        error: function () {
                            alert('网络繁忙，请稍后再试！');
                        }
                    });
                });
        } else if(obj.event === 'edit'){
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            layer.open({
                type: 2,
                title: '人员库（名片）-修改',
                shadeClose: false,
//                        shade: true,
                maxmin: true, //开启最大化最小化按钮
                area: [$(window).width()*0.7+'px', $(window).height()*0.7+'px'],
                content: './card-revise.html',
                success: function(layero, index){
                    layer.full(index)
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    // console.log(body.html()) //得到iframe页的body内容
                    body.find('#parent_PeopleId').val(data.People_id)
                    iframeWin.getInitData();
                }
            });
        }
    });

    var $ = layui.$, active = {
        getCheckData: function(){ //获取选中数据
            var checkStatus = table.checkStatus('idTest')
                ,data = checkStatus.data;
            layer.alert(JSON.stringify(data));
        }
        ,getCheckLength: function(){ //获取选中数目
            var checkStatus = table.checkStatus('idTest')
                ,data = checkStatus.data;
            layer.msg('选中了：'+ data.length + ' 个');
        }
        ,isAll: function(){ //验证是否全选
            var checkStatus = table.checkStatus('idTest');
            layer.msg(checkStatus.isAll ? '全选': '未全选')
        }
        //（执行搜索）数据重载
        ,reload: function(){
        var cardReload = $('#cardReload');
        var memberType = $('#People_member').val()
            console.log(memberType)
        //执行重载
        table.reload('renderReload', {
            url: 'http://' + changeUrl.address + '/People_api?whereFrom=searchByType',
            page: {
                curr: 1 //重新从第 1 页开始
            }
            ,where: {
                Type:memberType,
                searchMenu: cardReload.val(),
            }//需要传递的参数

        });
    }
    };

    $('.cardTable .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //添加回车事件
    $('#cardReload').keydown(function (e) {
        var curKey = e.which; //兼容火狐
        var cardReload = $('#cardReload');
        var memberType = $('#People_member').val()
        if(curKey == 13){
            //执行重载
            table.reload('renderReload', {
                url: 'http://' + changeUrl.address + '/People_api?whereFrom=searchByType',
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                ,where: {
                    Type:memberType,
                    searchMenu: cardReload.val(),
                }//需要传递的参数

            });
        }
    })

});



$('#addCard').on('click',function () {
    layui.use('layer', function(){
        layer.open({
            type: 2,
            title: '人员库（名片）-新增',
            shadeClose: false,
//                        shade: true,
            maxmin: true, //开启最大化最小化按钮
            area: [$(window).width()*0.7+'px', $(window).height()*0.7+'px'],
            content: './card-add.html',
            success:function (layero,index) {
               // console.log(layero,index)
                layer.full(index)
                var body = layer.getChildFrame('body', index);
                body.find('#People_name').val($('#cardReload').val())
            }
        });
    });

})

