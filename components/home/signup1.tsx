'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(3, 'Name must be at least 3 characters').optional()
});

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView: 'login' | 'signup';
  redirectPath?: string;
}

export function AuthDialog({ isOpen, onClose, defaultView, redirectPath = '/x' }: AuthDialogProps) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(defaultView === 'signup');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSignUp(defaultView === 'signup');
  }, [defaultView]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(
      isSignUp 
        ? formSchema.refine((data) => !!data.name, {
            message: "Name is required for signup",
            path: ["name"],
          })
        : formSchema.omit({ name: true })
    ),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    setIsLoading(true);
    try {
      if (isSignUp) {
        console.log('Starting signup process...');
        // Create the user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          values.email, 
          values.password
        );

        const db = getFirestore();
        
        // First create a new org document
        const orgRef = doc(collection(db, 'orgs'));
        await setDoc(orgRef, {
          createdAt: new Date(),
          updatedAt: new Date(),
          grantKey: '',
          orgID: '',
          owner: userCredential.user.uid
        });

        // Then create the user document with the org reference
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: values.email,
          name: values.name,
          createdAt: new Date(),
          subscriptionStatus: 'inactive',
          tier: 'free',
          updatedAt: new Date(),
          org: orgRef.id  // Reference to the org document
        });
      } else {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      }
      onClose();
      form.reset();
      console.log('Redirecting to:', redirectPath);
      router.push(redirectPath);
    } catch (error) {
      console.error('Auth error details:', error);
      const authError = error as AuthError;
      console.log('Auth error code:', authError.code);
      switch (authError.code) {
        case 'auth/email-already-in-use':
          form.setError('email', { message: 'Email already in use' });
          break;
        case 'auth/invalid-email':
          form.setError('email', { message: 'Invalid email address' });
          break;
        case 'auth/weak-password':
          form.setError('password', { message: 'Password is too weak' });
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          form.setError('root', { message: 'Invalid email or password' });
          break;
        default:
          form.setError('root', { message: 'An error occurred. Please try again.' });
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create an account' : 'Sign in'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await form.handleSubmit(onSubmit)(e);
              } catch (error) {
                console.error('Error in form submission:', error);
              }
            }} 
            className="space-y-4"
          >
            {form.formState.errors.root && (
              <div className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}
            {isSignUp && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : isSignUp ? 'Sign up' : 'Sign in'}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>{' '}
          <Button
            variant="link"
            className="p-0"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}