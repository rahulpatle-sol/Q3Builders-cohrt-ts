export type Turbin3Prereq = {
  version: "0.1.0";
  name: "turbin3_prereq";
  instructions: [
    {
      name: "initialize";
      accounts: [
        { name: "user"; isMut: true; isSigner: true },
        { name: "account"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "github"; type: "string" }
      ];
    },
    {
      name: "submitTs";
      accounts: [
        { name: "user"; isMut: true; isSigner: true },
        { name: "account"; isMut: true; isSigner: false },
        { name: "mint"; isMut: true; isSigner: true },
        { name: "collection"; isMut: false; isSigner: false },
        { name: "authority"; isMut: true; isSigner: false },
        { name: "mplCoreProgram"; isMut: false; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [];
    }
  ];
};

export const IDL: Turbin3Prereq = {
  version: "0.1.0",
  name: "turbin3_prereq",
  instructions: [
    {
      name: "initialize",
      accounts: [
        { name: "user", isMut: true, isSigner: true },
        { name: "account", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "github", type: "string" }
      ]
    },
    {
      name: "submitTs",
      accounts: [
        { name: "user", isMut: true, isSigner: true },
        { name: "account", isMut: true, isSigner: false },
        { name: "mint", isMut: true, isSigner: true },
        { name: "collection", isMut: false, isSigner: false },
        { name: "authority", isMut: true, isSigner: false },
        { name: "mplCoreProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: []
    }
  ]
};
