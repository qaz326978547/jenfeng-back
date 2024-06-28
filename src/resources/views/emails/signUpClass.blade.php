<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>信箱驗證</title>
    <style>
        span {
            color: blue;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <p>JENFENG 有新的報名資料</p>

    <p>報名公司:<span>{{$company}}</span></p>
    <p>報名課程:<span>{{$class}}</span></p>
    <p>報名人數:<span>{{$num}}</span></p>
    <p>公司聯絡電話:<span>{{$tel}}</span></p>
    <p>報名資料建立時間:<span>{{$sent_at}}</span></p>


    <p>請由此網頁做查看<a href="https://laborservice5690.com/admin/contact" target="_blank">https://laborservice5690.com/admin/contact</a></p>
</body>



</html>