"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const formatCurrency = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value
  return isNaN(num) ? '$0.00' : new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num)
}

const parseNumber = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0
}

export default function AIAG702Form() {
  const [formData, setFormData] = useState({
    owner: "",
    contractor: "",
    project: "",
    architect: "",
    applicationNo: "",
    periodTo: "",
    projectNos: "",
    contractDate: "",
    contractFor: "",
    originalContractSum: "$0.00",
    changeOrders: "$0.00",
    contractSumToDate: "$0.00",
    totalCompletedStored: "$0.00",
    retainagePercentage: "0",
    retainageAmount: "$0.00",
    totalEarnedLessRetainage: "$0.00",
    previousCertificates: "$0.00",
    currentPaymentDue: "$0.00",
    balanceToFinish: "$0.00",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Format currency fields
    if ([
      'originalContractSum',
      'changeOrders',
      'totalCompletedStored',
      'retainageAmount',
      'previousCertificates'
    ].includes(name)) {
      formattedValue = formatCurrency(value)
    }

    // Handle percentage field
    if (name === 'retainagePercentage') {
      const num = parseFloat(value)
      formattedValue = isNaN(num) ? '0' : Math.min(100, Math.max(0, num)).toString()
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }))
  }

  // Calculate derived values
  useEffect(() => {
    const originalSum = parseNumber(formData.originalContractSum)
    const changeOrdersSum = parseNumber(formData.changeOrders)
    const totalCompleted = parseNumber(formData.totalCompletedStored)
    const retainagePercent = parseFloat(formData.retainagePercentage) / 100
    const previousCerts = parseNumber(formData.previousCertificates)

    // Calculate contract sum to date
    const contractSum = originalSum + changeOrdersSum

    // Calculate retainage amount
    const retainageAmt = totalCompleted * retainagePercent

    // Calculate total earned less retainage
    const totalEarned = totalCompleted - retainageAmt

    // Calculate current payment due
    const currentPayment = totalEarned - previousCerts

    // Calculate balance to finish
    const balance = contractSum - totalEarned

    setFormData(prev => ({
      ...prev,
      contractSumToDate: formatCurrency(contractSum),
      retainageAmount: formatCurrency(retainageAmt),
      totalEarnedLessRetainage: formatCurrency(totalEarned),
      currentPaymentDue: formatCurrency(currentPayment),
      balanceToFinish: formatCurrency(balance)
    }))
  }, [
    formData.originalContractSum,
    formData.changeOrders,
    formData.totalCompletedStored,
    formData.retainagePercentage,
    formData.previousCertificates
  ])

  return (
    <div className="bg-white p-8 max-w-[8.5in] mx-auto text-xs border border-gray-300 shadow-lg">
      <div className="text-center font-bold mb-4">
        <div>APPLICATION AND CERTIFICATE FOR PAYMENT</div>
        <div>AIA DOCUMENT G702</div>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-4 mb-4">
        <div>
          <Label htmlFor="owner" className="font-bold">
            TO OWNER:
          </Label>
          <Input
            id="owner"
            name="owner"
            value={formData.owner}
            onChange={handleInputChange}
            className="border-b border-black"
          />
        </div>
        <div>
          <Label htmlFor="project" className="font-bold">
            PROJECT:
          </Label>
          <Input
            id="project"
            name="project"
            value={formData.project}
            onChange={handleInputChange}
            className="border-b border-black"
          />
        </div>
        <div>
          <Label htmlFor="contractor" className="font-bold">
            FROM CONTRACTOR:
          </Label>
          <Input
            id="contractor"
            name="contractor"
            value={formData.contractor}
            onChange={handleInputChange}
            className="border-b border-black"
          />
        </div>
        <div>
          <Label htmlFor="architect" className="font-bold">
            VIA ARCHITECT:
          </Label>
          <Input
            id="architect"
            name="architect"
            value={formData.architect}
            onChange={handleInputChange}
            className="border-b border-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 mb-4">
        <div>
          <Label htmlFor="applicationNo" className="font-bold">
            APPLICATION NO:
          </Label>
          <Input
            id="applicationNo"
            name="applicationNo"
            value={formData.applicationNo}
            onChange={handleInputChange}
            className="border-b border-black"
          />
        </div>
        <div>
          <Label htmlFor="periodTo" className="font-bold">
            PERIOD TO:
          </Label>
          <Input
            id="periodTo"
            name="periodTo"
            value={formData.periodTo}
            onChange={handleInputChange}
            className="border-b border-black"
          />
        </div>
        <div>
          <Label htmlFor="contractDate" className="font-bold">
            CONTRACT DATE:
          </Label>
          <Input
            id="contractDate"
            name="contractDate"
            value={formData.contractDate}
            onChange={handleInputChange}
            className="border-b border-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-4 mb-4">
        <div>
          <Label htmlFor="projectNos" className="font-bold">
            PROJECT NOS:
          </Label>
          <Input
            id="projectNos"
            name="projectNos"
            value={formData.projectNos}
            onChange={handleInputChange}
            className="border-b border-black"
          />
        </div>
        <div>
          <Label htmlFor="contractFor" className="font-bold">
            CONTRACT FOR:
          </Label>
          <Input
            id="contractFor"
            name="contractFor"
            value={formData.contractFor}
            onChange={handleInputChange}
            className="border-b border-black"
          />
        </div>
      </div>

      <div className="border border-black p-4 mb-4">
        <div className="font-bold mb-2">CONTRACTOR'S APPLICATION FOR PAYMENT</div>
        <div className="mb-2">Application is made for payment, as shown below, in connection with the Contract.</div>
        <div className="mb-2">Continuation Sheet, AIA Document G703, is attached.</div>

        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          <div className="font-bold">1. ORIGINAL CONTRACT SUM</div>
          <Input
            name="originalContractSum"
            value={formData.originalContractSum}
            onChange={handleInputChange}
            className="border-b border-black"
          />

          <div className="font-bold">2. Net change by Change Orders</div>
          <Input
            name="changeOrders"
            value={formData.changeOrders}
            onChange={handleInputChange}
            className="border-b border-black"
          />

          <div className="font-bold">3. CONTRACT SUM TO DATE (Line 1 ± 2)</div>
          <Input
            name="contractSumToDate"
            value={formData.contractSumToDate}
            onChange={handleInputChange}
            className="border-b border-black"
            readOnly
          />

          <div className="font-bold">4. TOTAL COMPLETED & STORED TO DATE</div>
          <Input
            name="totalCompletedStored"
            value={formData.totalCompletedStored}
            onChange={handleInputChange}
            className="border-b border-black"
          />

          <div className="font-bold">5. RETAINAGE:</div>
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <Input
              name="retainagePercentage"
              value={formData.retainagePercentage}
              onChange={handleInputChange}
              className="w-16 border-b border-black"
            />
            <Input
              name="retainageAmount"
              value={formData.retainageAmount}
              onChange={handleInputChange}
              className="border-b border-black"
            />
          </div>

          <div className="font-bold">6. TOTAL EARNED LESS RETAINAGE</div>
          <Input
            name="totalEarnedLessRetainage"
            value={formData.totalEarnedLessRetainage}
            onChange={handleInputChange}
            className="border-b border-black"
            readOnly
          />

          <div className="font-bold">7. LESS PREVIOUS CERTIFICATES FOR PAYMENT</div>
          <Input
            name="previousCertificates"
            value={formData.previousCertificates}
            onChange={handleInputChange}
            className="border-b border-black"
          />

          <div className="font-bold">8. CURRENT PAYMENT DUE</div>
          <Input
            name="currentPaymentDue"
            value={formData.currentPaymentDue}
            onChange={handleInputChange}
            className="border-b border-black"
            readOnly
          />

          <div className="font-bold">9. BALANCE TO FINISH, INCLUDING RETAINAGE</div>
          <Input
            name="balanceToFinish"
            value={formData.balanceToFinish}
            onChange={handleInputChange}
            className="border-b border-black"
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-black p-4">
          <div className="font-bold mb-2">CHANGE ORDER SUMMARY</div>
          <div className="grid grid-cols-[1fr_1fr] gap-2 mb-2">
            <div className="font-bold text-center">ADDITIONS</div>
            <div className="font-bold text-center">DEDUCTIONS</div>
          </div>
          <div className="grid grid-cols-[1fr_1fr] gap-2">
            <Input className="border-b border-black" />
            <Input className="border-b border-black" />
          </div>
        </div>
        <div className="border border-black p-4">
          <div className="mb-2">
            The undersigned Contractor certifies that to the best of the Contractor's knowledge, information and belief
            the Work covered by this Application for Payment has been completed in accordance with the Contract
            Documents, that all amounts have been paid by the Contractor for Work for which previous Certificates for
            Payment were issued and payments received from the Owner, and that current payment shown herein is now due.
          </div>
          <div className="font-bold mb-2">CONTRACTOR:</div>
          <Input className="border-b border-black mb-2" />
          <div className="font-bold">By:</div>
          <Input className="border-b border-black" />
        </div>
      </div>
    </div>
  )
}

