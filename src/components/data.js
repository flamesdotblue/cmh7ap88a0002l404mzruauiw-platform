const PARTNERS = ['Acme Bank', 'Northwind Finance', 'BlueRiver Capital', 'Sunrise Lending', 'Pioneer Credit']
const PRODUCTS = ['Personal Loan', 'Credit Line', 'Auto Loan', 'Home Equity', 'SMB Working Capital']
const STATUSES = ['Approved', 'Pending', 'Rejected', 'In Review']

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomName() {
  const first = ['Ava', 'Liam', 'Mia', 'Noah', 'Ella', 'Ethan', 'Zoe', 'Mason', 'Luna', 'James', 'Kai', 'Nora']
  const last = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Lee', 'Martin', 'Clark', 'Lewis', 'Walker', 'Young']
  return `${randomItem(first)} ${randomItem(last)}`
}

export function generateLoans(n = 100) {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  return Array.from({ length: n }).map((_, i) => {
    const createdAt = new Date(now - Math.floor(Math.random() * 120) * day)
    const updatedAt = new Date(createdAt.getTime() + Math.floor(Math.random() * 20) * day)
    const amount = Math.floor(2000 + Math.random() * 48000)
    return {
      id: `LN-${(100000 + i).toString()}`,
      applicant: randomName(),
      partner: randomItem(PARTNERS),
      product: randomItem(PRODUCTS),
      amount,
      status: randomItem(STATUSES),
      score: Math.floor(500 + Math.random() * 400),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    }
  })
}

export const META = { PARTNERS, PRODUCTS, STATUSES }
