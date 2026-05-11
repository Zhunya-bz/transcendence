"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
});

export const CreateProject = () => {
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    console.log(values);
  };

  return (
    <Card className="w-full h-full border-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new project
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator className="bg-gray-400" />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField 
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                                Project name
                        </FormLabel>
                        <FormControl>
                          <Input 
                          {...field}
                          placeholder="Enter project name"
                          />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <Button type="submit" size="lg" variant='ghost' className="bg-orange-400">
                  Create project
                </Button>
                </div>
            </form>
            
        </Form>
      </CardContent>
    </Card>
  );
};
