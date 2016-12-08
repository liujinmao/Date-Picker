class DatePicker {
    constructor(options) {
        this.options = $.extend({
            content: null,
            startYear: 1900,
            endYear: 2100
        }, options);
        this.element = this.options.content;
        this.temp = `<div class="conrainer-date"></div>`;
        this.table = null;
        this.yearSelect = null;
        this.monthSelect = null;
        this.creatDatePicker();
     }
     // 初始化
    creatDatePicker(){
        this.left = this.options.content.offset().left; // 日期组件显示的距左边的位置
        this.top = this.options.content.offset().top + this.options.content.height();  // 日期组件显示的距上边的位置
        this.nowDate = new Date();
        this.nowYear = this.nowDate.getFullYear();
        this.nowMonth = this.nowDate.getMonth();
        this.nowDay = this.nowDate.getDate();
        this.ele = $(this.temp);

        let monthSelect = '<div class="choose-month">';
        this.allMonth = ['JAN','FRE','MAR','APRIL','MAY','JUN','JULY','AUG','SEP','OCT','NOV','DOC'];
        for(let a = 0 ; a < this.allMonth.length ; a++){
            if(a == this.nowMonth){
                monthSelect += `<span class="choose-month-active" >${this.allMonth[a]}</span>`;
            }else{
                monthSelect += `<span>${this.allMonth[a]}</span>`;
            }

        }
        monthSelect+='</div>';
        this.monthSelect = $(monthSelect);

        let yearSelect = `<div class="header-date"><select class="choose-year" value="" >`;
        for(let i = this.options.startYear ; i < this.options.endYear ; i++){
            if(i == this.nowYear){
                yearSelect += `<option value="${i}" selected >${i}年</option>`;
            }else{
                yearSelect += `<option value="${i}">${i}年</option>`;
            }

        }
        yearSelect +='</select></div>';
        this.yearSelect = $(yearSelect);
        this.ele.append(this.yearSelect);
        this.ele.append(this.monthSelect);
        this.getAllDate(this.nowYear,this.nowMonth,this.nowDay);
        this.events();
        this.changeDate();
        this.changeMonth();

     }

     // 判断是否为闰年
    isLeapYear(year){
        return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)? 1: 0;
     }

     // 创建日历
    getAllDate(year,month,date){
        // 创建table
        this.firstDay = new Date(year,month,1).getDay(); // 本月的第一天
        let table = '<div class="choose-date"><table><thead><tr><td>SUN</td><td>MON</td><td>TUE</td><td>WED</td><td>THU</td><td>FRI</td><td>SAT</td></tr></thead><tbody>'
        let m_days = new Array(31,28+this.isLeapYear(year),31,30,31,30,31,31,30,31,30,31);
        let trLineNumber = Math.ceil((m_days[month] + this.firstDay)/7);
        let idx = 0,date_str = 0;
        // let n_day = new Date();
        for(let j = 0; j < trLineNumber; j ++){
            table += '<tr>';
            for(let k = 0 ; k < 7; k++){
                idx=j*7+k;
                date_str = idx-this.firstDay+1; // 计算日期
                if(date_str <= 0 || date_str > m_days[month]){
                    table +="<td> </td>";
                }else{
                    if(year==this.nowDate.getFullYear() && month==this.nowDate.getMonth() && this.nowDate.getDate()==date_str){
                        table += "<td><span class='choose-date-active'>"+ date_str +"</span></td>";
                    }else{
                        table += "<td><span>"+ date_str +"</span></td>";
                    }

                }
            }
            table += '</tr>';
        }
        table += '</tbody></table></div>';
        this.table = $(table);
        this.ele.append(this.table);
        $('body').append(this.ele);

     }

     // changetd
    changeDate(){
        let that = this;
        this.table.on('click','td',function(){
            that.nowDay = $(this).text();
            $(this).children().addClass('choose-date-active');
            $(this).siblings().children().removeClass('choose-date-active');
            $(this).parent('tr').siblings().children().children().removeClass('choose-date-active');
            if(that.options.content.val()){
                that.options.content.val(that.nowYear+'-'+(that.nowMonth+1)+'-'+that.nowDay)
            }else{
                that.options.content.html(that.nowYear+'-'+(that.nowMonth+1)+'-'+that.nowDay)
            }
            $('.conrainer-date').hide();
        })
     }

    changeMonth(){
        let that = this;
        this.monthSelect.on('click','span',function(){
            $(this).addClass('choose-month-active').siblings().removeClass('choose-month-active');
            that.nowMonth = $(this).index();
            that.table.remove();
            that.getAllDate(that.nowYear,that.nowMonth,that.nowDay);
            that.changeDate()
        })
     }

    events(){
        let that = this;
         this.options.content.on('click',function(){
            let e = window.event|| event;
            if(e.stopPropagation){
                e.stopPropagation()
            }else{
                e.cancelBubble = true;
            }
            $('.conrainer-date').css({'top':that.top,'left':that.left});
            $('.conrainer-date').show();

        });

        this.ele.on('click',function(){
            let e = window.event|| event;
            if(e.stopPropagation){
                e.stopPropagation()
            }else{
                e.cancelBubble = true;
            }
        });

        this.yearSelect.on('change','select',function(){
            that.nowYear = $(this).val();
            that.table.remove();
            that.getAllDate(that.nowYear,that.nowMonth,that.nowDay);
            that.changeDate();
            that.changeMonth();
        });

        $(document).on('click',function(){
            $('.conrainer-date').hide();
        });      

    }
}

window.DatePicker = DatePicker;
