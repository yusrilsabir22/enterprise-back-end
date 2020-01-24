const ONE_TO_MANY = () => {
    const sql = `SELECT 
                    employee.employeeID,
                    employee.name AS employee_name,
                    employee.role AS employee_role,
                    employee.address AS employee_address,
                    customers.customersID,
                    customers.name AS customers_name,
                    customers.email AS customers_email,
                    order_product.count AS count,
                    products.name AS product_name,
                    products.price AS product_price,
                    category.name AS category 
                FROM 
                    order_product 
                INNER JOIN 
                    orders 
                ON 
                    order_product.orderID = orders.orderID 
                INNER JOIN 
                    customers 
                ON 
                    orders.customerID = customers.customersID 
                INNER JOIN 
                    employee 
                ON 
                    orders.employeeID = employee.employeeID 
                INNER JOIN 
                    products 
                ON 
                    order_product.productID = products.productID 
                INNER JOIN 
                    category 
                ON 
                    products.categoryID = category.categoryID
                
    `
}

// const data = {
//     dt: [{
//             order_product: ['count']
//         },
//         {
//             product: ['name', 'price']
//         },
//         {
//             category: ['name']
//         },
//         {
//             employee: ['name', 'address']
//         },
//         {
//             customer: ['name', 'email']
//         }
//     ],
//     from: 'order_product',
//     cond: [{
//         join: ['order_product', 'dorder'],
//         on: 'orderID',
//         val: 77091
//     }, {
//         join: ['dorder', 'customer'],
//         on: 'customerID'
//     }, {
//         join: ['dorder', 'employee'],
//         on: 'employeeID'
//     }, {
//         join: ['order_product', 'product'],
//         on: 'productID'
//     }, {
//         join: ['product', 'category'],
//         on: 'categoryID'
//     }]
// }

const exCond = [{join: Array, on: String}]
const fieldName = Array
const exDt = [{tableName: fieldName}]

const exData = {
    dt: exDt,
    from: String,
    cond: exCond
}
/**
 * 
 * @param {exData} data 
 * 
 */

const innerJoin = (data) => {
    const checkData = (data) => {
        if (typeof data === 'string') {
            return 'string'
        } else if (typeof Object.getPrototypeOf(data) === 'object') {
            return 'object'
        }
    }

    let sqlTop = 'SELECT '
    let sqlBody = ''
    let sqlFoot = ' '
    let idx = 0
    let listKey = []
    for (let i of data.dt) {
        if (checkData(i) === 'object') {
            let tempQuery = ``
            let keys = ''
            for (let [key, value] of Object.entries(i)) {
                let tmp = ''
                let index = 0
                for (let val of value) {
                    let temp = ''
                    if (index > 0) {
                        if (index === (value.length - 1)) {
                            // temp = key + '.' + val + ' AS'
                            temp = `${key}.${val} AS ${key}_${val}`
                        } else {
                            temp = `${key}.${val} AS ${key}_${val},`
                        }
                    } else {
                        if (index === (value.length - 1)) {
                            temp = `${key}.${val} AS ${key}_${val}`
                        } else {
                            temp = `${key}.${val} AS ${key}_${val},`
                        }
                    }
                    tmp += temp
                    index = index + 1
                }
                tempQuery += tmp
                keys = key
            }
            sqlBody += tempQuery
            listKey.push(keys)
        } else if (checkData(i) === 'string') {
            if (idx === (data.dt.length - 1)) {
                sqlBody += ',' + i + '.* '
            } else {
                sqlBody += i + '.*'
            }

            listKey.push(i)
        }

        if (idx < (data.dt.length - 1)) {
            sqlBody += ','
        }

        idx += 1
    }
    let dd = ` FROM ${data.from} `
    // sql foot
    for (let val of data.cond) {
        // if(data.cond.val)
        let q = `INNER JOIN ${val.join[1]} ON ${val.join[0]}.${val.on} = ${val.join[1]}.${val.on} `
        if (val.val) {
            q = `INNER JOIN ${val.join[1]} ON ${val.join[0]}.${val.on} = ${val.val} `
        }
        dd += q
    }
    sqlFoot += dd
    return sqlTop+sqlBody+sqlFoot
}

module.exports = {
    innerJoin
}