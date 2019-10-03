$(document).ready(function(){
    var length, index, pdt, src, desc, type, event, event_date, alt, date; 
    var count = 0;
    var charcount = 0;
    var beltcount1 = 0;
    var beltcount2 = 1;
    var light_count = 0;
    var gif = false;
    var type_cart = [];
    var html = '';
    var txt = '';
    var event_date = [];
    
    $.ajax({
        url : '../json/snsitems.json',
        method : 'GET',
        dataType : 'Json',
    }).done(function(data){
        pdt = data;

        fill_ul(fill_new_cart(find_type(0)));
    })

    $.ajax({
        url : '../json/event_date.json',
        method : 'GET',
        dataType : 'json'
    }).done(function(data){
        event = data;
        
        for(var i in event){
            event_date.push(event[i].date);
        }
        fillCalender(event_date);
        fill_event(5);
    })
    
    $(document).on('click', '.sns_list_li', function(){
        html ='';
        type_cart = [];
        index = $(this).index();
        $('.sns_list_li').removeClass('section5_li_focus');
        $('.sns_list_li').eq(index).addClass('section5_li_focus');
        var index_type = find_type(index);    
        fill_new_cart(index_type);
    })

    // gif 설정
    $(document).on('mousewheel', 'html body', function(){
        var scrollTop = $(window).scrollTop();
        $('.cal_giftbox').removeClass('opacity1');
        if(scrollTop>969 && scrollTop<1969 && !gif){
            gif=true;
            $('.zergling').children('img').attr('src', 'img/section2/deco1.gif');
            setTimeout(function(){
                gif=false;
            }, 2000)
        }else if(scrollTop>=1969 && scrollTop<2969){
            $('.cal_giftbox').addClass('opacity1');
        }else if(scrollTop>=5059 && scrollTop<6059 && !gif){
            gif=true;
            $('.section6_gif').children('img').attr('src', 'img/section6/section6_gif.gif');
            setTimeout(function(){
                gif=false;
            }, 3000)
        }
    })

    // 벨트애니메이션
    beltmove()
    // 시작하자마자 첫벨트는 바로시작
    $(document).on('mouseleave', '.char_img', function(){
        beltmove()
    })
    
    // 캐릭터 움짤
    // 1344 448
    charmove();
    function charmove(){      
        var range = [];
        setInterval(function(){
            range = [];
            for(var i=0; i<20; i++){
                if($('.char_wrap').eq(i).offset().left<=1344 && $('.char_wrap').eq(i).offset().left>=478){
                    range.push(i);
                }
            }    
        }, 1000)
        
        setInterval(function(){
            $('.char_img').parent('.char_wrap').siblings('.char_txt').removeClass('char_txt_animation');
            for(var b in range){
                $('.char_img').eq(range[b]).parent('.char_wrap').siblings('.char_txt').addClass('char_txt_animation');
            }
        }, 1000)

        setInterval(function(){
            charcount++;
            charcount=charcount%15;
            for(var a in range){
                $('.char_img').eq(range[a]).css('left', charcount*-100+'%');
            }
        },50)
    }

    $(document).on('click', '.familysite', function(){
        count++;
        count=count%2;
        if(count==1){
            $('.familysite_sub').addClass('displayblock')
        }else{
            $('.familysite_sub').removeClass('displayblock')
        }
    })

    // 암전
    $(document).on('click', '.light_btn', function(){
        light_count++;
        light_count=light_count%2;
        if(light_count==1){
            $('.light_on').removeClass('displayblock');
            $('.light_off').addClass('displayblock');

            $('.body_wrap').addClass('dark_bg');
            $('.main_section').addClass('off');

            $('.neon_tit').addClass('neon_tit_animation');
            $('.neon_logo').addClass('neon_logo_animation');
        }else {
            $('.light_off').removeClass('displayblock');
            $('.light_on').addClass('displayblock');

            $('.body_wrap').removeClass('dark_bg');
            $('.main_section').removeClass('off');

            $('.neon_tit').removeClass('neon_tit_animation');
            $('.neon_logo').removeClass('neon_logo_animation');
        }
    })

    // section3 달력
    var today = new Date();
    var real_today = new Date();

    fillCalender(today);

    $(document).on('click', '.present_month_btn', function(){
        today = new Date();
        fillCalender(today);
        fill_event(5);
    })

    
    $(document).on('click', '.date_width', function(){
        var event_index = $(this).parent().index();
        fill_event(event_index);
    })    

    $(document).on('click', '.prev', function(){
        prevCalender();
        if(today.getFullYear()!=real_today.getFullYear()||today.getMonth()!=real_today.getMonth()){
            $('.cal_inform_img').attr('src', 'img/section3/event/event_comming_soon.png')
        }else{
            fill_event(5);
        }
    })  

    $(document).on('click', '.next', function(){
        nextCalender();
        if(today.getFullYear()!=real_today.getFullYear()||today.getMonth()!=real_today.getMonth()){
            $('.cal_inform_img').attr('src', 'img/section3/event/event_comming_soon.png')
        }else{
            fill_event(5);
        }
    })

    // 함수모음
    function beltmove(){
        function anonymous(fnc){
            return function(){
                fnc.apply(fnc, arguments);
                return fnc;
            }
        }
        setInterval(anonymous(function(){
            $('.beltmove').eq(beltcount1).animate({
                left : -2240
            },{
                duration : 30000,
                easing : 'linear',
                complete : function(){
                    $('.beltmove').css('left', 2240);
                }
            })
            $('.beltmove').eq(beltcount2).animate({
                left : 0
            }, {
                duration : 30000,
                easing : 'linear'
            })
            beltcount1++;
            beltcount1=beltcount1%2
            beltcount2++;
            beltcount2=beltcount2%2
        })(), 30000)
    }

    // section5 채우기
    // type 찾기
    function find_type(index){
        switch(index){
            case 0 : {
                return 'All'
            }break;
            case 1 : {
                return 'Facebook'
            }break;
            case 2 : {
                return 'Instagram'
            }break;
            case 3 : {
                return 'Youtube'
            }break;
        }
    }

    // type 에 맞는 정보 카트에 넣기
    function fill_new_cart(index_type){
        for(var i in pdt){
            if(pdt[i].all == index_type){
                type_cart.push(pdt[i])
            }else if(pdt[i].type == index_type){
                type_cart.push(pdt[i]);
            }
        }
        fill_ul(type_cart);
    }

    // 채워진 카트로 내용 바꾸기
    function fill_ul(type_cart){
        for(var i in type_cart){
            txt ='';
            src = type_cart[i].src;
            desc = type_cart[i].desc;
            type = type_cart[i].type;

            txt = '<div class="sns_item"><div class="frame"><div class="type_logo_'+type+' sns_banner"></div><img src="'+src+'" class="sns_topic"></div><div class="desc">'+desc+'</div></div>'

            html = html+txt;
        }
        $('.section5_sns_box').html(html);
    }

    // 달력 관련
    // 이전 달
    function prevCalender(){
        today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        // console.log(today);
        fillCalender(today)
    }

    // 다음 달
    function nextCalender(){
        today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        // console.log(today);
        fillCalender(today)
    }

    // 달력 채우기
    function fillCalender(){
        var cal_html = '';
        var cal_txt = '';
        var cal_blank_txt = '';
        var cal_blank_html = '';
        var month_arr = ['JANUARY', 'FEBURARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        // 첫째날
        var first_date = new Date(today.getFullYear(), today.getMonth(), 1);
        // 마지막날 (다음달 첫째날(1)의 전날(0))
        var last_date = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        $('.year').html(today.getFullYear());
        var eng_month = month_arr[today.getMonth()];
        $('.month').html(eng_month);

        // console.log(first_date.getDay())
        for(var q=0; q<first_date.getDay(); q++){
            cal_blank_txt = '';
            cal_blank_txt = '<div class="cal_size"></div>'

            cal_blank_html = cal_blank_html + cal_blank_txt;
        }
        $('.cal_date').html(cal_blank_html);

        // console.log(last_date.getDate())
        for(var d=1; d<=last_date.getDate(); d++){
            cal_txt = '';
            var event_point = '';

            for(var e in event_date){
                if(d==event_date[e]&&real_today.getMonth()+1==today.getMonth()+1&&real_today.getFullYear()==today.getFullYear()){
                    event_point = '<div class="event_point"></div>'
                }
            }
            
            if(d==real_today.getDate()&&real_today.getMonth()+1==today.getMonth()+1&&real_today.getFullYear()==today.getFullYear()){
                cal_txt = '<div class="cal_size"><span class="today_check date_width">'+d+'</span>'+event_point+'</div>'
            }else{
                cal_txt = '<div class="cal_size"><span class="date_width">'+d+'</span>'+event_point+'</div>'
            }

            cal_html = cal_html + cal_txt;
        }
        $('.cal_date').append(cal_html);

        setTimeout(function(){
            $('.event_point').siblings('.date_width').css({
                'cursor' : 'pointer',
                'font-weight' : 'bold'
            });
        },)
    }

    // 행사있는날 표시되게 하기
    function fill_event(event_index){
        for(var i in event){
            if(event[i].date==event_index+1&&event[i].year==today.getFullYear()&&event[i].month==today.getMonth()+1){
                date = event[i].date;
                src = event[i].src;
                alt = event[i].alt;

                $('.event_point').removeClass('event_point_focus');
                $('.date_width').removeClass('font_white');
                $('.date_width').eq(event_index).siblings('.event_point').addClass('event_point_focus');
                $('.date_width').eq(event_index).addClass('font_white');

                $('.cal_inform_img').attr('src', src);
                $('.cal_inform_img').attr('alt', alt);
            }else{
                $('.cal_inform_img').attr('src', 'img/section3/event/event_comming_soon.png');
                $('.cal_inform_img').attr('alt', '다음이벤트를 기대해주세요~');
            }
        }
    }
})