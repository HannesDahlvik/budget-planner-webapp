export default function checkNumber(num: any) {
    if (num < 10) return '0' + num
    else return num
}