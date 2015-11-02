function topSearch(){
	var dataType=$("#dataType").combobox("getValue");
	var goodsCode=$("#goodsCode").combobox("getValue");
	var goodsName=$("#goodsName").combobox("getValue");
	var date=$("#date").datebox("getValue");
	var endDate=$("#endDate").datebox("getValue");
	var top=$("#top").combobox("getValue");
	var deal=$("#deal").combobox("getValue");
	 $.ajax({
  	   url:basePath + "/chart/queryPortDetailAnalysis.action",
  	   type:"POST",
  	   data:{'dataType':dataType,'goodsCode':goodsCode,'date':date,'top':top,
  		   'deal':deal,'port':port,'endDate':endDate,'goodsName':goodsName},
  	   success:function(result){
  		   var res=eval('(' + result + ')');
  		   if (res.success){
  			   var data=[];
  			   var category = [];
  			   var data1=[];
  			    for(var i=0;i<res.rows.length;i++){
  			    	data.push(res.rows[i].quorum);
  			    	category.push(res.rows[i].runComName);
  			    	data1.push(res.rows[i].price);
  			   }
  			  mychart.xAxis[0].setCategories(category);
			  mychart.series[0].setData(data);
			  mychart.series[1].setData(data1);
			  if(res.total>0){
				  $("#content").html("<li style='color:red'>根据以上统计结果显示："+res.rows[0].runComName+"发往"+port+
						 "的货物量最多，为"+ res.rows[0].quorum+res.rows[0].unit+"</br></li>");
				  showGrid(res.rows);
			  }else{
				  $("#content").html("");
				  showGrid([]);
			  }
			  
  		   	} 
  	   	}
     });
}


function showGrid(data){
	$('#listGrid').datagrid({
		//pagination:true,//分页效果
	    rownumbers:true, 
	    fitColumns:false, 
	    ctrlSelect : true,//在启用多行选择的时候允许使用Ctrl键+鼠标点击的方式进行多选操作。
	    fit : true, //填充整个面板
	    loadMsg:"数据正在加载中，请稍后",
	    singleSelect:true,
	    striped : true, //是否显示斑马线效果。
	    data:data,
	    columns:[[
	          {field:'runComName',title:'公司',width:'20%',align:'center'},
	          {field:'quorum',title:'销量',width:'20%',align:'center'},
	          {field:'unit',title:'单位',width:'20%',align:'center'},
	          {field:'price',title:'均价',width:'20%',align:'center'},
	          {field:'currency',title:'币种',width:'20%',align:'center'}
	    ]]
	});
}



var mychart;
$(function () {
	$('#goodsCode').combobox({
		 //传参数
		onBeforeLoad: function(param){
			param.dataType = $("#dataType").combobox("getValue");
		},
    	url: basePath + '/chart/queryGoodsCode.action',
    	valueField:'goodsCode', 
    	textField:'goodsCode' 
	});
	
	 $("#dataType").combobox("setValue",dataType);
	 $("#port").textbox("setValue",port);
	 $("#top").combobox("setValue",tops);
	 $("#goodsCode").combobox("setValue",goodsCode);
	 showGoodsName();
	 $("#goodsName").combobox("setValue",goodsName);
	 $("#date").datebox("setValue",date); 
	 $("#endDate").datebox("setValue",endDate); 
	 $("#deal").combobox("setValue",deal); 
	 
	 mychart = new Highcharts.Chart({
		 	chart:{
        		renderTo:'chart',
            	zoomType:'xy'
        	},
			title: { text: '公司在港口现状分析' }, 
			xAxis: { 
				  	title:{text:'公司'},
					categories:[],
					labels: {//设置横轴坐标的显示样式  
						rotation: -45//倾斜度
					}
				},
			yAxis: [{ 
				min: 0, 
				title: { 
					text: '销量' }//y轴
			},{
				min:0,
				title:{
					text:'均价',
				},
				opposite:true
			}],
			tooltip: { 
				shared: true,
			}, 
			plotOptions: {
				column: { 
						pointPadding: 0.2,
						borderWidth: 0
						}
				}, 
			series: [{
							name:"销量",
							type:'column',
							yAxis:0,
							data:[]/*,
							dataLabels: { enabled: true }*/
					},{
						name:'价格',
						type:'spline',
						yAxis:1,
						//dataLabels: { enabled: true },
						tooltip:{
							valueSuffix:''//值后面添加后缀
						},
						data:[]
							
					}] 
				}); 
	 
	 topSearch();
})

function showGoodsName(){
	$("#goodsName").combobox({
		 //传参数
		onBeforeLoad: function(param){
			param.dataType = $("#dataType").combobox("getValue");
			param.goodsCode = $("#goodsCode").combobox("getValue");
		},
		url: basePath + '/chart/queryGoodsName.action',
		valueField:'goodsName', 
		textField:'goodsName' 
	});
}