import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
} from './ui/alert-dialog';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { v4 as uuid } from "uuid";
import Navbar from './Navbar';

const API_URL = import.meta.env.VITE_API_URL;
// const authToken = localStorage.getItem('auth-token');

// Sort Icons
const SortAscIcon = () => (
    <svg className="w-3 h-3 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

const SortDescIcon = () => (
    <svg className="w-3 h-3 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export default function WalletDashboard() {
    const location = useLocation();
    const [authToken, setAuthToken] = useState(localStorage.getItem("auth-token"));
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
    const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [search, setSearch] = useState('');
    const [sortColumn, setSortColumn] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [loginUser, setLoginUser] = useState({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch wallet data
    const fetchData = async () => {
        try {
            const url = `${API_URL}/wallet/`;
            const response = await axios.get(url, {
                headers: { "Authorization": `Bearer ${authToken}` },
            });
            if (response.status === 200) {
                setBalance(response.data.wallet.balance);
                setTransactions(response.data.transactions);
                setLoginUser(response.data.wallet.user);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error(error.response.data.message);
            } else {
                console.error(error);
            }
        }
    };

    const getUsers = async () => {
        try {
            const url = `${API_URL}/auth/get-users`;
            const response = await axios.get(url, {
                headers: { "Authorization": `Bearer ${authToken}` },
            });
            if (response.status === 200) {
                setUsers(response.data.users);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error(error.response.data.message);
            } else {
                console.error(error);
            }
        }
    }
    useEffect(() => {
        fetchData();
        getUsers();
    }, [location, authToken]);

    // Handle adding funds
    const handleAddFunds = async () => {
        const parsedAmount = parseFloat(amount);
        if (parsedAmount > 0) {
            try {
                const url = `${API_URL}/wallet/add`;
                const response = await axios.post(url, {
                    amount: parsedAmount,
                    transactionId: uuid()
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                if (response.status === 200) {
                    setMessage(response.data.message);
                    setAmount("");
                    setIsAddDialogOpen(false);
                    fetchData();
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Handle withdrawing funds
    const handleWithdrawFunds = async () => {
        const parsedAmount = parseFloat(amount);
        if (parsedAmount > 0 && parsedAmount <= balance) {
            try {
                const url = `${API_URL}/wallet/withdraw`;
                const response = await axios.post(url, {
                    amount: parsedAmount,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                if (response.status === 200) {
                    setMessage(response.data.message);
                    setAmount("");
                    setIsWithdrawDialogOpen(false);
                    fetchData();
                }
                console.log(response);

            } catch (error) {
                console.log(error);
            }
        } else {
            setError("Transfer failed! Check balance or recipient wallet.")
            setIsWithdrawDialogOpen(false);
        }
    };

    // Handle transferring funds
    const handleTransferFunds = async () => {
        const parsedAmount = parseFloat(amount);
        if (parsedAmount > 0 && parsedAmount <= balance) {
            try {
                const url = `${API_URL}/wallet/transfer`;
                const response = await axios.post(url, {
                    amount: parsedAmount,
                    recipientId: recipientId,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                if (response.status === 200) {
                    setMessage(response.data.message);
                    setAmount("");
                    setIsTransferDialogOpen(false);
                    fetchData();
                }
                console.log(response);

            } catch (error) {
                console.log(error);
            }
        } else {
            setError("Transfer failed! Check balance or recipient wallet.")
            setIsTransferDialogOpen(false);
        }
    };

    // Filter and sort transactions
    const filteredTransactions = transactions.filter((txn) =>
        txn.amount.toString().includes(search)
    );

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const currentTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (sortColumn === 'date') {
            return sortDirection === 'asc'
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        } else if (sortColumn === 'amount') {
            return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        } else if (sortColumn === 'type') {
            return sortDirection === 'asc'
                ? a.type.localeCompare(b.type)
                : b.type.localeCompare(a.type);
        }
        return 0;
    });

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        return `${date.toLocaleDateString('en-GB', options)} ${date.toLocaleTimeString('en-US', timeOptions)}`;
    };

    const getTransactionLabel = (type) => {
        switch (type) {
            case 'credit':
                return 'Deposit';
            case 'debit':
                return 'Withdrawal';
            case 'send':
                return 'Sent';
            case 'receive':
                return 'Received';
            default:
                return 'Unknown';
        }
    };

    const getDescription = (transaction) => {
        if (transaction.recipientId == null) {
            return transaction.type == "credit" ? "Self deposit" : "Self withdrawal";
        }
        if (transaction.type == "send") {
            return `Paid to ${transaction.recipientId.name}`;
        }
        return `Received from ${transaction.recipientId.name}`;
    }

    return (
        <>        
        <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Hello, {loginUser.name}</h1>
            {/* Wallet Section */}
            <div className="flex justify-center items-center">
                {message &&
                    <Alert className="bg-green-400 p-2 max-w-md w-full">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>
                            <strong className='text-black'>{message}</strong>
                        </AlertDescription>
                    </Alert>
                }
            </div>
            <div className="flex justify-center items-center">
                {error &&
                    <Alert variant="destructive" className="bg-red-400 p-2 max-w-md w-full">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className='text-black'>Error</AlertTitle>
                        <AlertDescription>
                            <strong className='text-black'>{error}</strong>
                        </AlertDescription>
                    </Alert>
                }
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-lg shadow-lg text-white mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-2xl font-semibold flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0z" />
                            </svg>
                            Wallet Balance
                        </h3>
                        <p className="text-4xl font-extrabold mt-2">₹{balance.toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-4">
                        {/* Add Funds Button */}
                        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-500 hover:bg-green-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Funds
                        </Button>

                        {/* Withdraw Funds Button */}
                        <Button onClick={() => setIsWithdrawDialogOpen(true)} className="bg-red-500 hover:bg-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                            Withdraw Funds
                        </Button>

                        {/* Transfer Funds Button */}
                        <Button onClick={() => setIsTransferDialogOpen(true)} className="bg-purple-500 hover:bg-purple-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
                            </svg>
                            Transfer Funds
                        </Button>
                    </div>
                </div>
            </div>

            {/* Transaction History Section with Increased Width */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Transaction History</h3>
                <Input
                    type="text"
                    placeholder="Search transactions by amount..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                />
                {sortedTransactions.length === 0 ? (
                    <p className="text-gray-500">No transactions found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentTransactions.map((txn, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{txn.transactionId}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${txn.type === 'credit' || txn.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
                                            {getTransactionLabel(txn.type)}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${txn.type === 'credit' || txn.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
                                            {txn.type === 'credit' || txn.type === 'receive' ? '+' : '-'} ₹{txn.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(txn.timestamp)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{getDescription(txn)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="mx-1"
                    >
                        Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {index + 1}
                        </Button>
                    ))}
                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="mx-1"
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Add Funds Dialog */}
            <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <AlertDialogTrigger asChild>
                    <Button className="hidden">Open Add Funds Dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white p-6 rounded-lg shadow-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">Add Funds</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                            Enter the amount you want to add to your wallet.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mb-4 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    />
                    <AlertDialogFooter className="flex justify-end space-x-2">
                        <Button onClick={() => setIsAddDialogOpen(false)} className="bg-gray-300 hover:bg-gray-400 transition-colors">
                            Cancel
                        </Button>
                        <Button onClick={handleAddFunds} className="bg-green-500 hover:bg-green-600 transition-colors">
                            Add
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Withdraw Funds Dialog */}
            <AlertDialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                <AlertDialogTrigger asChild>
                    <Button className="hidden">Open Withdraw Funds Dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white p-6 rounded-lg shadow-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">Withdraw Funds</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                            Enter the amount you want to withdraw from your wallet.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mb-4 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    />
                    <AlertDialogFooter className="flex justify-end space-x-2">
                        <Button onClick={() => setIsWithdrawDialogOpen(false)} className="bg-gray-300 hover:bg-gray-400 transition-colors">
                            Cancel
                        </Button>
                        <Button onClick={handleWithdrawFunds} className="bg-red-500 hover:bg-red-600 transition-colors">
                            Withdraw
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Transfer Funds Dialog */}
            <AlertDialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                <AlertDialogTrigger asChild>
                    <Button className="hidden">Open Transfer Funds Dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white p-6 rounded-lg shadow-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">Transfer Funds</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                            Enter the recipient wallet ID and amount you want to transfer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <select
                        value={recipientId}
                        onChange={(e) => setRecipientId(e.target.value)}
                        className="mb-4 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all rounded-md shadow-sm p-2 w-full"
                    >
                        <option value="" disabled>Select recipient</option>
                        {users.filter(user => user.id !== loginUser.id).map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <Input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mb-4 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    />
                    <AlertDialogFooter className="flex justify-end space-x-2">
                        <Button onClick={() => setIsTransferDialogOpen(false)} className="bg-gray-300 hover:bg-gray-400 transition-colors">
                            Cancel
                        </Button>
                        <Button onClick={handleTransferFunds} className="bg-purple-500 hover:bg-purple-600 transition-colors">
                            Transfer
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        </>
    );
}