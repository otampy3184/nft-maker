# NFT Minter

Hardhatから独自コントラクトをDeployし、Reactのフロントエンド上からNFT用のMetadata画像を選択しMintできる

## 実行環境

* macOS Monterey 12.2.1
* Node.js v16.14.2
* Solidity 0.8.9
* React.js 18.2.0
* Hardhat 2.12.2

## 事前準備

GithubからコードをClone(GitとNodejsが事前に入っている前提)

```;
git clone https://github.com/otampy3184/nft-minter.git
```

cloneしたディレクトリに移動し、packageをインストールする

```;
cd nft-minter/backend
npm i
cd ../frontend
npm i
```

.envファイルを作成し、以下のような内容にする。

```;
SECRET_KEY="個人のMetamask等から取得したEthereumアドレスのシークレットキーを貼り付ける。41jdifa...みたいなやつ"
API_KEY_MUM="Alchemyから取得したAPIKEYを貼り付ける。https://polygon-mumbbai.g.alchemy.com/v2/...みたいなやつ"
```

AlchemyからのAPIキー取得方法は[こちら](https://www.youtube.com/watch?v=o3sO3KjwfAg)

Metamaskのシークレットキー取得方法は[こちら](https://www.wise-sendai.jp/metamask-key/)

また、テスト上記のAPI_KEYはテスト用だったのでPolygonメインネットではなくMumbaiテストネットに向いている。本番用に動作させたい場合は別途本番用のAPI_KEYを取得し、hardhat.config.tsを編集すること

```ts:
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      //url: process.env.API_KEY,
      //accounts: [process.env.SECRET_KEY],
    },
    matic: {
      url: process.env.API_KEY_MUM,
      accounts: [`0x${process.env.SECRET_KEY}`],
    },
    // この辺にpolygon用の設定情報を追記する
    // 書き方はmaticと同じでOK
  },
};
```

## 利用方法

基本的にはlocalhost上で動かすことでそのまま利用ができる

```;
cd client
npm run start
```

また、Vecelなどにデプロイすることも可能

## メモ

その他の注意点、改善点など

* 本番環境ではもちろん本物のMaticかEthを用意し、利用アカウントに入金しておくこと
* EthereumにするかPolygonにするかは慎重に検討した方がよい
  * Web3Strageの動作がEthereumで経由で使う場合どうにも不安定で、しょっちゅうMetadataのアップロードに失敗する
  * Polygonに切り替えたら安定動作した
  * Ethereumに切り替える際は上手いこと調整を行う必要あり
    * 調整の際はReactjs側のアップデートを行なった方がよい？

## 主要なソースコードの説明

client/src/components/NFTUploader/NFTUploader.jsx

```javascript:NFTUploader.jsx
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義
   */
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
```

画面上でMetamaskウォレットが接続されているかを確認する(後のuseEffectで利用)

```javascript:NFTUploader.jsx
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };
```

Metamaskからウォレット情報を画面上に繋ぐ処理を呼び出す

```javascript:NFTUploader.jsx
  const connectWallet = async () => {
    try {
      // Metamaskから取れるEthereumオブジェクトはwindowの中に入っている
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /*
       * ウォレットアドレスに対してアクセスをリクエスト
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      /*
       * ウォレットアドレスを currentAccount に紐付け
       */
      setCurrentAccount(accounts[0]);

      // EventListnerを起動させる
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };
```

Solidityコントラクトを呼び出してNFTのMint処理を呼び出す

```javascript:NFTUploader.jsx
  const askContractToMintNft = async (ipfs) => {
    try {
      // この辺の処理はConnectWalletと同じ
      const { ethereum } = window;
      if (ethereum) {
        // コントラクトをフロントエンドから呼び出す際は"abi", "signer", "contract address"が必要
        // abi　はHardhat側でコンパイルしたものをフロントエンド側にコピーしてImportしておく
        // signer はwallet情報から取得するが、取得のためにMetamask接続情報が詰まったethereumオブジェクトを利用する
        // contract addressはHardhat側でコントラクトをデプロイした際に出てくるアドレスを持ってくる(今回はハードコーディングしてある)
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        // ↑で作成したconnectedContractインスタンスはSolidityコントラクトの関数を呼び出せる
        // 単純にconnectedContract.*someFunction*(*params*)で呼び出す
        // mintIpfsNFTは引数としてNFTの名前とIPFSのURL情報が必要
        // IPFSのURL情報は下のimageToNFT()の中で作成している
        // コントラクト実行は非同期処理で行うこと
        let nftTxn = await connectedContract.mintIpfsNFT("sample", ipfs);
        console.log("Mining...please wait.");
        // トランザクションが確実に実行されるよう、wait()処理を実行する
        await nftTxn.wait();
        console.log(
          `Mined, see transaction: https://mumbai.etherscan.io/tx/${nftTxn.hash}`
        );
        setIsLoading(false);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
```

フロントエンド上から直接呼び出される関数

```javascript:NFTUploader.jsx
  const imageToNFT = async (e) => {
    // Loadingアイコンを使うためStateを更新
    setIsLoading(true);
    // Web3Storageのクライアント
    // 外部利用をする場合、API_KEYはgitに上げていない.envフォルダに書かれているため、自分でクライアントAPI_KEYをとってくること
    const client = new Web3Storage({ token: API_KEY })
    const image = e.target
    console.log(image)

    // ここで一度Web3Storage経由でIPFSにアップロードする
    // nameとかはなんでもいい
    const rootCid = await client.put(image.files, {
      name: 'experiment',
      maxRetries: 3
    })

    // アップロードされたファイルをとってくる
    // よくここで失敗する
    const res = await client.get(rootCid) // Web3Response
    const files = await res.files() // Web3File[]
    for (const file of files) {
      console.log("file.cid:", file.cid)
      askContractToMintNft(file.cid)
    }
  }
```

## ContractAddress

```;
Mumbai:0xE2e0Cb146b13AA1C15a62e52Bc69D58496596438
```
