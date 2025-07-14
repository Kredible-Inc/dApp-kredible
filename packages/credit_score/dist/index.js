import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CAEO63GYC4PVD4DIX4S7RE6B35LGQB5LIUJRJ2QK44BJJIPMVPYBVMFP",
    }
};
export const Errors = {};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAAJc2V0X3Njb3JlAAAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAABXNjb3JlAAAAAAAABAAAAAA=",
            "AAAAAAAAAAAAAAAJZ2V0X3Njb3JlAAAAAAAAAQAAAAAAAAAEdXNlcgAAABMAAAABAAAABA=="]), options);
        this.options = options;
    }
    fromJSON = {
        set_score: (this.txFromJSON),
        get_score: (this.txFromJSON)
    };
}
