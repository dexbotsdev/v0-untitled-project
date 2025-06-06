"use client"

interface Wallet {
  id: number
  address: string
  solBalance: number
  tokenBalance: number
  tradeAmount?: number
}

interface WalletTableProps {
  wallets: Wallet[]
  type: string
  selectedWallets?: number[]
  onSelectWallet?: (id: number, selected: boolean) => void
  onSellTokens?: () => void
}

export function WalletTable({ wallets, type, selectedWallets = [], onSelectWallet, onSellTokens }: WalletTableProps) {
  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Format SOL balance
  const formatSolBalance = (balance: number) => {
    return balance.toFixed(3)
  }

  // Format token balance
  const formatTokenBalance = (balance: number) => {
    return balance.toLocaleString()
  }

  // Check if a wallet is selected
  const isSelected = (id: number) => {
    return selectedWallets.includes(id)
  }

  // Handle row click for selection
  const handleRowClick = (id: number) => {
    if (onSelectWallet) {
      onSelectWallet(id, !isSelected(id))
    }
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-800 rounded-md">
            <thead className="bg-[#1A1A1A] sticky top-0 z-10">
              <tr className="border-b border-gray-800">
                <th className="text-xs text-gray-400 font-medium p-2 text-left w-10">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-700 text-amber-600 focus:ring-amber-500"
                      onChange={(e) => {
                        if (onSelectWallet) {
                          wallets.forEach((wallet) => {
                            onSelectWallet(wallet.id, e.target.checked)
                          })
                        }
                      }}
                      checked={selectedWallets.length === wallets.length && wallets.length > 0}
                    />
                  </div>
                </th>
                <th className="text-xs text-gray-400 font-medium p-2 text-left">#</th>
                <th className="text-xs text-gray-400 font-medium p-2 text-left">Wallet Address</th>
                <th className="text-xs text-gray-400 font-medium p-2 text-right">SOL Balance</th>
                <th className="text-xs text-gray-400 font-medium p-2 text-right">Token Balance</th>
                {type === "bundle" && (
                  <th className="text-xs text-gray-400 font-medium p-2 text-right">Trade Amount</th>
                )}
              </tr>
            </thead>
            <tbody>
              {wallets.map((wallet) => (
                <tr
                  key={wallet.id}
                  className={`border-b border-gray-800/30 hover:bg-gray-800/20 ${isSelected(wallet.id) ? "bg-amber-900/20" : ""}`}
                  onClick={() => handleRowClick(wallet.id)}
                >
                  <td className="text-xs p-2 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-700 text-amber-600 focus:ring-amber-500"
                      checked={isSelected(wallet.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        if (onSelectWallet) {
                          onSelectWallet(wallet.id, e.target.checked)
                        }
                      }}
                    />
                  </td>
                  <td className="text-xs p-2">{wallet.id}</td>
                  <td className="text-xs p-2 font-mono text-amber-400">{formatAddress(wallet.address)}</td>
                  <td className="text-xs p-2 text-right">{formatSolBalance(wallet.solBalance)} SOL</td>
                  <td className="text-xs p-2 text-right">{formatTokenBalance(wallet.tokenBalance)}</td>
                  {type === "bundle" && wallet.tradeAmount && (
                    <td className="text-xs p-2 text-right">{wallet.tradeAmount.toFixed(2)} SOL</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
