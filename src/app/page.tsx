'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { z } from 'zod';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phoneRegex = /^010\d{8}$/;

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: '이름은 2글자 이상이어야 합니다.' })
    .max(50, { message: '이름은 50글자 이하이어야 합니다.' }),
  email: z.string().email({ message: '올바른 이메일을 입력해주세요.' }),
  phone: z
    .string()
    .min(11, { message: '연락처는 11자리여야 합니다.' })
    .max(11, '연락처는 11자리여야 합니다.')
    .refine(
      (value) => phoneRegex.test(value),
      '010으로 시작하는 11자리 숫자를 입력해주세요'
    ),
  role: z.string(),
  password: z
    .string()
    .min(6, '비밀번호는 최소 6자리 이상이어야 합니다.')
    .max(100, '비밀번호는 100자리 이하이어야 합니다.')
    .refine(
      (value) => passwordRegex.test(value),
      '비밀번호는 최소 6자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다.'
    ),
  confirmPassword: z
    .string()
    .min(6, '비밀번호는 최소 6자리 이상이어야 합니다.')
    .max(100, '비밀번호는 100자리 이하이어야 합니다.')
    .refine(
      (value) => passwordRegex.test(value),
      '비밀번호는 최소 6자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다.'
    ),
});

export default function LoginForm() {
  const [pagenum, setPagenum] = useState<number>(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      email: '',
      role: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const vailidate = async () => {
    await form.trigger(['username', 'email', 'phone', 'role']);
    const phoneState = form.getFieldState('phone');
    const emailState = form.getFieldState('email');
    const usernameState = form.getFieldState('username');
    const roleState = form.getFieldState('role');

    if (!phoneState.isDirty || phoneState.invalid) return;
    if (!emailState.isDirty || emailState.invalid) return;
    if (!usernameState.isDirty || usernameState.invalid) return;
    if (!roleState.isDirty || roleState.invalid) return;
    setPagenum(1);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { password, confirmPassword } = values;

    if (password !== confirmPassword)
      toast({
        variant: 'destructive',
        title: '비밀번호가 일치하지 않습니다',
      });
    alert(JSON.stringify(values));
  };

  return (
    <div className="m-[9rem]">
      <Card>
        <CardHeader>
          <CardTitle>계정을 생성합니다</CardTitle>
          <CardDescription>필수 정보를 입력해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 overflow-x-hidden relative"
            >
              <motion.div
                className={cn('space-y-3')}
                animate={{ translateX: `${pagenum * -100}%` }}
                transition={{ ease: 'easeIn' }}
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="hello@sparta-devcamp.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>연락처</FormLabel>
                      <FormControl>
                        <Input placeholder="01000000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>역할</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="역할을 선택해주세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="관리자">관리자</SelectItem>
                          <SelectItem value="일반사용자">일반사용자</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div
                className={cn('space-y-3 absolute top-0 left-0 right-0')}
                animate={{ translateX: `${(1 - pagenum) * 100}%` }}
                style={{ translateX: `${(1 - pagenum) * 100}%` }}
                transition={{ ease: 'easeIn' }}
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호</FormLabel>
                      <FormControl>
                        <Input type={'password'} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호 확인</FormLabel>
                      <FormControl>
                        <Input type={'password'} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <Button
                type="button"
                onClick={() => {
                  vailidate();
                }}
                className={cn({ hidden: pagenum === 1 })}
              >
                다음 단계로
              </Button>
              <Button
                type="submit"
                onClick={() => setPagenum(1)}
                className={cn({ hidden: pagenum === 0 })}
              >
                계정 생성하기
              </Button>
              <Button
                type="button"
                onClick={() => setPagenum(0)}
                variant="ghost"
                className={`${cn({ hidden: pagenum === 0 })} ml-2`}
              >
                이전 단계로
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
