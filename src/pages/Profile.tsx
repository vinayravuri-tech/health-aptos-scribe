
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, User, Bell, Key, Lock, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WalletConnect from '@/components/WalletConnect';

const Profile = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();

  const handleWalletConnect = (address: string) => {
    setWalletConnected(true);
    setWalletAddress(address);
    toast({
      title: "Wallet Connected",
      description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
    });
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-medical-dark mb-6">Account Settings</h1>
          
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="wallet" className="gap-2">
                <Shield className="h-4 w-4" />
                Wallet
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select 
                      id="gender" 
                      className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-medical-primary"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                  
                  <Button 
                    onClick={handleSaveProfile}
                    className="gap-2 bg-medical-primary hover:bg-medical-primary/90"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <Button className="gap-2 bg-medical-primary hover:bg-medical-primary/90">
                    <Key className="h-4 w-4" />
                    Update Security Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Health Summaries</p>
                        <p className="text-sm text-gray-500">Get notifications about new health summaries</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">NFT Minting</p>
                        <p className="text-sm text-gray-500">Get alerts when your NFTs are minted</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing & Updates</p>
                        <p className="text-sm text-gray-500">Receive marketing and product updates</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <Button className="gap-2 bg-medical-primary hover:bg-medical-primary/90">
                    <Bell className="h-4 w-4" />
                    Update Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="wallet">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Connection</CardTitle>
                  <CardDescription>
                    Connect your Aptos wallet to mint and secure your medical NFTs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {walletConnected ? (
                    <div>
                      <div className="flex items-center justify-between p-4 bg-medical-secondary rounded-lg mb-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-medical-primary/10 rounded-full flex items-center justify-center">
                            <Shield className="h-5 w-5 text-medical-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Connected Wallet</p>
                            <p className="text-sm text-gray-500">
                              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-medical-primary">
                          Disconnect
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Auto-Mint NFTs</p>
                            <p className="text-sm text-gray-500">Automatically mint NFTs for new medical summaries</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">NFT Privacy</p>
                            <p className="text-sm text-gray-500">Keep your medical NFTs private and encrypted</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="h-16 w-16 bg-medical-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-medical-primary" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Wallet Connected</h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Connect your Aptos wallet to securely mint and manage your medical NFTs on the blockchain.
                      </p>
                      <WalletConnect onConnect={handleWalletConnect} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
