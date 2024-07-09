type TCategory = 'fruit' | 'vegetables'
interface IProduct {
    id:number,
    price:number,
    name:string,
    color?:string,
    ferm?:string,
    category:TCategory
}
type TDiscountSettings = {
    [K in TCategory]: number
  }

interface IReceipt {
    totalWithoutDiscount:number,
    totalWithDiscount:number,
    discount:TDiscountSettings,
    items:IProduct[]
}
type ICalculateFuncProp = (products:IProduct[], discount:TDiscountSettings)=> IReceipt
const calculateTotal:ICalculateFuncProp = (products, discount) => {
    return   products.reduce((acc,el,index)=>{
        const currentCategory = discount[el.category]
        acc.totalWithoutDiscount += el.price
        acc.totalWithDiscount += (el.price * currentCategory)
        return acc
    },{items:products, discount, totalWithoutDiscount:0,totalWithDiscount:0})
}
const discountPercentage: TDiscountSettings = {fruit:10,vegetables:30}
const products:IProduct[] = [
    {id:1,price:20,name:'apple', color:'red',category:'fruit'},
    {id:12,price:30,name:'cucumber', ferm:'alaska',category:'vegetables'}
]
const result = calculateTotal(products, discountPercentage)
console.log('receipt', result)