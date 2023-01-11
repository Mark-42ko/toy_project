export class AddBlah {
  user: [
    {
      email: string;
      name: string;
      phoneNumber: string;
    },
  ];
  blah: [
    {
      name: string;
      profile: string | undefined;
      comments: string;
      date: Date;
      counts: [string];
      filePath: string;
      filename: string;
      filesize: number;
    },
  ];
  status: string;
}
